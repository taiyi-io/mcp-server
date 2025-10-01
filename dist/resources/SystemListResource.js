import { MCPResource, logger } from "mcp-framework";
import { getConnector } from "../server.js";
import { marshalPermissions } from "../utils.js";
/**
 * 系统模板视图转换函数
 * 将系统模板对象转换为JSON字符串
 */
function marshalSystemView(view) {
    const obj = {};
    // 映射属性
    if (view.id !== undefined) {
        obj["标识"] = view.id;
    }
    if (view.label !== undefined) {
        obj["名称"] = view.label;
    }
    if (view.is_system === true) {
        obj["系统模板"] = true;
    }
    if (view.category !== undefined) {
        obj["操作系统"] = view.category;
    }
    if (view.removable !== undefined) {
        obj["光驱"] = view.removable;
    }
    if (view.disk !== undefined) {
        obj["磁盘"] = view.disk;
    }
    if (view.network !== undefined) {
        obj["网卡"] = view.network;
    }
    if (view.firmware !== undefined) {
        obj["启动方式"] = view.firmware;
    }
    marshalPermissions(view, obj);
    return JSON.stringify(obj);
}
/**
 * 系统模板列表资源
 * 返回当前用户可以访问的所有系统模板列表
 */
class SystemListResource extends MCPResource {
    uri = "resource://system/";
    name = "系统模板列表";
    description = "返回当前用户可以访问的所有系统模板列表，包含模板标识、名称、类型、操作系统、硬件配置和权限信息。通常用于创建云主机时选择系统模板。";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        let allSystems = [];
        let offset = 0;
        const pageSize = 20;
        let total = 0;
        try {
            // 第一次请求获取总数
            const firstResponse = await connector.querySystems(offset, pageSize, false);
            if (firstResponse.error) {
                throw new Error(firstResponse.error);
            }
            else if (!firstResponse?.data) {
                throw new Error("获取系统模板列表失败：返回数据为空");
            }
            total = firstResponse?.data?.total || 0;
            allSystems = firstResponse?.data?.records
                ? [...firstResponse.data.records]
                : [];
            // 根据总数计算需要请求的偏移量
            const requests = [];
            offset += pageSize;
            // 从下一个偏移量开始请求剩余数据
            while (offset < total) {
                requests.push(connector.querySystems(offset, pageSize, false));
                offset += pageSize;
            }
            // 并行请求所有剩余页面
            if (requests.length > 0) {
                const responses = await Promise.all(requests);
                for (const response of responses) {
                    if (response?.data?.records) {
                        allSystems = [...allSystems, ...response.data.records];
                    }
                }
            }
            // 处理系统模板数据
            const resources = [];
            if (Array.isArray(allSystems)) {
                // 构建返回多个resource对象
                allSystems.forEach((system) => {
                    if (system.id !== undefined) {
                        const systemURI = `${this.uri}${system.id}`;
                        const text = marshalSystemView(system);
                        resources.push({
                            uri: systemURI,
                            mimeType: this.mimeType,
                            text: text,
                        });
                    }
                    else {
                        logger.warn("发现没有ID的系统模板，跳过资源创建");
                    }
                });
            }
            else {
                logger.warn("系统模板数据格式不正确");
            }
            return resources;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`读取系统模板列表资源时发生错误: ${errorMessage}`);
            return [
                {
                    uri: "",
                    mimeType: "text/plain",
                    text: errorMessage,
                },
            ];
        }
    }
}
export default SystemListResource;
