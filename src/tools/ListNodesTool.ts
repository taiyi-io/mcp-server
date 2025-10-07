import { MCPTool } from "mcp-framework";
import { getConnector } from "../server.js";
import { marshalNodeData } from "../utils.js";

class ListNodesTool extends MCPTool {
  name = "list-nodes";
  description = "获取所有节点列表，包含节点名称、标识、核心数、内存、磁盘容量和运行状态信息";

  schema = {};

  async execute() {
    try {
      const connector = await getConnector();
      const result = await connector.queryNodes();
            if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("获取节点列表失败：返回数据为空");
      }
      const nodes = result.data;      
      const formattedNodes = nodes.map(node => marshalNodeData(node));      
      return `系统当前共有 ${nodes.length} 个节点:\n ${formattedNodes.join("\n")}`;
    } catch (error) {
      return `获取节点列表失败：${error instanceof Error ? error.message : String(error)}`;
    }
  }
}

export default ListNodesTool;