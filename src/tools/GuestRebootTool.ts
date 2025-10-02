import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface GuestRebootInput {
  guestID: string;
}

class GuestRebootTool extends MCPTool<GuestRebootInput> {
  name = "guest-reboot";
  description = "重启云主机。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";

  schema = {
    guestID: {
      type: z.string(),
      description: "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
    },
  };

  async execute(input: GuestRebootInput) {
    try {
      const connector = await getConnector();
      const { guestID } = input;

      // 执行重启操作: reboot=true, force=false
      const result = await connector.stopGuest(guestID, true, false);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return `成功重启云主机 ${guestID}`;
    } catch (error) {
      const output = `重启云主机失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestRebootTool;