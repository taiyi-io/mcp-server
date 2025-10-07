import { MCPTool } from "mcp-framework";
import { getConnector } from "../server.js";
import { getAllSystems, marshalSystemView } from "../utils.js";
import z from "zod";

interface ListSystemsInput {
  selfOnly?: boolean; // 是否只显示自己的系统模板
}

class ListSystemsTool extends MCPTool<ListSystemsInput> {
  name = "list-systems";
  description = "获取所有系统模板列表，包含模板名称、标识、操作系统类型、核心数、内存和磁盘配置信息";

  schema = {
    selfOnly: {
      type: z.boolean().optional(),
      description: "是否只查询自己创建的系统模板",
      default: false
    }
  };

  async execute(input: ListSystemsInput) {
    try {
      const connector = await getConnector();
      const systems = await getAllSystems(connector, input.selfOnly || false);
      
      const formattedSystems = systems.map(system => marshalSystemView(system));
      
      return `系统当前共有 ${systems.length} 个系统模板:\n ${formattedSystems.join("\n")}`;
    } catch (error) {
      return `获取系统模板列表失败：${error instanceof Error ? error.message : String(error)}`;
    }
  }
}

export default ListSystemsTool;