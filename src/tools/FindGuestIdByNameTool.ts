import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { findGuestIDByName } from "../utils.js";
import { getConnector } from "../server.js";

interface FindGuestIdByNameInput {
  name: string;
}

class FindGuestIdByNameTool extends MCPTool<FindGuestIdByNameInput> {
  name = "find-guest-id-by-name";
  description =
    "通过云主机名称查找云主机ID。如果需要调用云主机接口，只有云主机名称而没有云主机id时，通过本接口获得正确id再调用目标tool";

  schema = {
    name: {
      type: z.string(),
      description: "云主机名称",
    },
  };

  async execute(input: FindGuestIdByNameInput) {
    try {
      const connector = await getConnector();
      const id = await findGuestIDByName(connector, input.name);
      return `云主机${input.name}的id为${id}`;
    } catch (error) {
      const output =
        error instanceof Error ? error.message : "查找云主机ID失败";
      logger.error(output);
      return output;
    }
  }
}

export default FindGuestIdByNameTool;
