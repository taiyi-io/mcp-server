import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { findSystemIDByLabel } from "../utils.js";
import { getConnector } from "../server.js";

interface FindSystemIdByNameInput {
  name: string;
}

class FindSystemIdByNameTool extends MCPTool<FindSystemIdByNameInput> {
  name = "find-system-id-by-name";
  description =
    "通过系统模板名称查找系统模板ID。如果需要调用系统模板接口，只有系统模板名称而没有系统模板id时，通过本接口获得正确id再调用目标tool";

  schema = {
    name: {
      type: z.string(),
      description: "系统模板名称",
    },
  };

  async execute(input: FindSystemIdByNameInput) {
    try {
      const connector = await getConnector();
      const id = await findSystemIDByLabel(connector, input.name);
      return `系统模板${input.name}的id为${id}`;
    } catch (error) {
      const output =
        error instanceof Error ? error.message : "查找系统模板ID失败";
      logger.error(output);
      return output;
    }
  }
}

export default FindSystemIdByNameTool;
