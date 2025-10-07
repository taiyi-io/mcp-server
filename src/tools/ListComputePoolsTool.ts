import { MCPTool } from "mcp-framework";
import { getConnector } from "../server.js";
import { ComputePoolStatus } from "@taiyi-io/api-connector-ts";
import { marshalComputePool } from "../utils.js";


class ListComputePoolsTool extends MCPTool {
  name = "list-compute-pools";
  description = "获取所有计算资源池列表，包含标识、描述、存储池、地址池、状态和资源限制信息";

  schema = {
    // 不需要特定输入参数
  };

  async execute() {
    try {
      const connector = await getConnector();
      const result = await connector.queryComputePools();
      
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("获取计算资源池列表失败：返回数据为空");
      }

      const pools: ComputePoolStatus[] = result.data;
      const formattedPools = pools.map(pool => marshalComputePool(pool));
      
      return `系统当前共有 ${pools.length} 个计算资源池: ${formattedPools.join("\n")}`
    } catch (error) {
      return `获取计算资源池列表失败：${error instanceof Error ? error.message : String(error)}`
    }
  }
}

export default ListComputePoolsTool;