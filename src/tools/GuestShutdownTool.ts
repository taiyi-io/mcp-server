import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface GuestShutdownInput {
  guestID: string;
}

class GuestShutdownTool extends MCPTool<GuestShutdownInput> {
  name = "guest-shutdown";
  description = "正常关闭云主机。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";

  schema = {
    guestID: {
      type: z.string(),
      description: "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
    },
  };

  async execute(input: GuestShutdownInput) {
    try {
      const connector = await getConnector();
      const { guestID } = input;

      // 执行正常关机操作: reboot=false, force=false
      const result = await connector.stopGuest(guestID, false, false);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return `成功正常关闭云主机 ${guestID}`;
    } catch (error) {
      const output = `正常关闭云主机失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestShutdownTool;