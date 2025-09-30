import { logger, MCPResource } from "mcp-framework";
import { getConnector } from "../server.js";
import { marshalFileView } from "../utils.js";
async function fetchAllISOImages(connector, selfOnly) {
    let allImages = [];
    let offset = 0;
    const pageSize = 20;
    let total = 0;
    try {
        // 第一次请求获取总数
        const firstResponse = await connector.queryISOFiles(offset, pageSize, selfOnly);
        if (firstResponse.error) {
            throw new Error(firstResponse.error);
        }
        else if (!firstResponse?.data) {
            throw new Error("获取ISO镜像列表失败：返回数据为空");
        }
        total = firstResponse?.data?.total || 0;
        allImages = firstResponse?.data?.records
            ? [...firstResponse.data.records]
            : [];
        // 根据总数计算需要请求的偏移量
        const requests = [];
        offset += pageSize;
        // 从下一个偏移量开始请求剩余数据
        while (offset < total) {
            requests.push(connector.queryISOFiles(offset, pageSize, selfOnly));
            offset += pageSize;
        }
        // 并行请求所有剩余页面
        if (requests.length > 0) {
            const responses = await Promise.all(requests);
            for (const response of responses) {
                if (response?.data?.records) {
                    allImages = [...allImages, ...response.data.records];
                }
            }
        }
        // 构建返回多个resource对象，按照指定格式
        const resourcesList = allImages.map((image) => {
            const imageURI = `resource://iso-image/${image.id}/detail`;
            const text = marshalFileView(image);
            return {
                uri: imageURI,
                mimeType: "application/json",
                text: text,
            };
        });
        return resourcesList;
    }
    catch (error) {
        const output = `获取ISO镜像列表失败：${error instanceof Error ? error.message : String(error)}`;
        logger.error(output);
        return [
            {
                uri: "",
                mimeType: "text/plain",
                text: output,
            },
        ];
    }
}
class IsoImageResourceList extends MCPResource {
    uri = "resource://iso-image/";
    name = "ISO镜像列表";
    description = "获取所有ISO镜像的列表，通常用于启动云主机或者加载光盘时，让用户选择目标iso镜像，然后使用镜像id调用启动云主机或者加载光盘指令";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        return await fetchAllISOImages(connector, false);
    }
}
export default IsoImageResourceList;
