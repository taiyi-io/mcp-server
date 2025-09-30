import { logger, MCPResource } from "mcp-framework";
import { marshalFileView } from "../utils.js";
import { getConnector } from "../server.js";
async function fetchAllDiskImages(connector, selfOnly) {
    let allImages = [];
    let offset = 0;
    const pageSize = 20;
    let total = 0;
    try {
        // 第一次请求获取总数
        const firstResponse = await connector.queryDiskFiles(offset, pageSize, selfOnly);
        if (firstResponse.error) {
            throw new Error(firstResponse.error);
        }
        else if (!firstResponse?.data) {
            throw new Error("获取磁盘镜像列表失败：返回数据为空");
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
            requests.push(connector.queryDiskFiles(offset, pageSize, selfOnly));
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
            const imageURI = `resource://disk-image/${image.id}/detail`;
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
        const output = `获取磁盘镜像列表失败：${error instanceof Error ? error.message : String(error)}`;
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
class DiskImageListResource extends MCPResource {
    uri = "resource://disk-image/";
    name = "磁盘镜像列表";
    description = "返回当前用户可以访问的所有磁盘镜像列表，包含id、名称、描述、创建修改时间、容量信息。通常用于创建云主机时，选择目标镜像，然后使用磁盘镜像id调用创建云主机指令";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        return await fetchAllDiskImages(connector, false);
    }
}
export default DiskImageListResource;
