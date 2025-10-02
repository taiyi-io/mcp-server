import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface GuestModifyHostnameInput {
  guestID: string;
  hostname: string;
}

class GuestModifyHostnameTool extends MCPTool<GuestModifyHostnameInput> {
  name = "guest-modify-hostname";
  description =
    "指定云主机ID和新的主机名，修改云主机的主机名称。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
    },
    hostname: {
      type: z
        .string()
        .min(1)
        .regex(/^[a-zA-Z][a-zA-Z0-9-]*$/, {
          message: "主机名必须以字母开头，只能包含字母、数字和连字符（-）",
        }),
      description:
        "新的主机名，不能为空，必须以字母开头，只能包含字母、数字和连字符",
    },
  };

  async execute(input: GuestModifyHostnameInput) {
    try {
      const connector = await getConnector();

      const result = await connector.modifyGuestHostname(
        input.guestID,
        input.hostname
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return `成功将云主机 ${input.guestID} 的主机名修改为 ${input.hostname}`;
    } catch (error) {
      const output = `修改云主机主机名失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestModifyHostnameTool;
