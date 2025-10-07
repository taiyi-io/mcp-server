import { MCPResource, logger } from "mcp-framework";
import { getConnector } from "../server.js";
import { marshalStoragePool } from "../utils.js";
/**
 * 存储资源池列表资源
 * 返回当前用户可以访问的所有存储资源池列表
 */
class StoragePoolResource extends MCPResource {
    uri = "resource://storage-pool/";
    name = "存储资源池列表";
    description = "返回当前用户可以访问的所有存储资源池列表，包含标识、类型、分配策略、描述、存储容器数量、已分配磁盘卷、已使用容量、可用容量和最大容量信息。通常用于查看存储利用状况和创建计算资源池时，选择目标存储";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        try {
            // 调用queryStoragePools一次性获取所有存储资源池
            const result = await connector.queryStoragePools();
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("获取存储资源池列表失败：返回数据为空");
            }
            const pools = result.data;
            // 构建返回多个resource对象，按照指定格式
            const resourcesList = pools.map((pool) => {
                const poolURI = `resource://storage-pool/${pool.id}/detail`;
                const text = marshalStoragePool(pool);
                return {
                    uri: poolURI,
                    mimeType: "application/json",
                    text: text,
                };
            });
            return resourcesList;
        }
        catch (error) {
            const output = `获取存储资源池列表失败：${error instanceof Error ? error.message : String(error)}`;
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
}
export default StoragePoolResource;
