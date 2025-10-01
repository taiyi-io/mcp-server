import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface GuestResetMonitorInput {
  guestID: string;
}

class GuestResetMonitorTool extends MCPTool<GuestResetMonitorInput> {
  name = "guest-reset-monitor";
  description =
    "指定云主机ID，重置云主机的监控密码，影响远程控制权限，重置后需要使用新密码登录";

  schema = {
    guestID: {
      type: z.string(),
      description: "云主机的ID",
    },
  };

  async execute(input: GuestResetMonitorInput) {
    try {
      const connector = await getConnector();
      const result = await connector.resetMonitor(input.guestID);

      if (result.error) {
        throw new Error(result.error);
      }

      return `成功重置云主机 ${input.guestID} 的监控密码`;
    } catch (error) {
      const output = `重置云主机监控密码失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestResetMonitorTool;
