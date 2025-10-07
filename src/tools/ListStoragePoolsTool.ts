import { MCPTool } from "mcp-framework";
import { getConnector } from "../server.js";
import { marshalStoragePool } from "../utils.js";

class ListStoragePoolsTool extends MCPTool {
  name = "list-storage-pools";
  description = "获取所有存储资源池列表，包含标识、类型、分配策略、描述、存储容器数量、已分配磁盘卷、已使用容量、可用容量和最大容量信息";

  schema = {};

  async execute() {
    try {
      const connector = await getConnector();
      
      // 调用queryStoragePools一次性获取所有存储资源池
      const result = await connector.queryStoragePools();
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("获取存储资源池列表失败：返回数据为空");
      }

      const pools = result.data;
      const formattedPools = pools.map(pool => marshalStoragePool(pool));
      
      return `系统当前共有 ${pools.length} 个存储资源池:\n ${formattedPools.join("\n")}`;
    } catch (error) {
      return `获取存储资源池列表失败：${error instanceof Error ? error.message : String(error)}`;
    }
  }
}

export default ListStoragePoolsTool;