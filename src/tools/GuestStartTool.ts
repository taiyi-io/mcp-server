import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { TaiyiConnector } from "@taiyi-io/api-connector-ts";

interface GuestStartInput {
  guestID: string;
}

class GuestStartTool extends MCPTool<GuestStartInput> {
  name = "guest-start";
  description = "启动云主机，支持同步等待结果";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
    },
  };

  async execute(input: GuestStartInput) {
    try {
      const connector: TaiyiConnector = await getConnector();

      // 调用connector启动云主机
      const result = await connector.tryStartGuest(input.guestID);

      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("启动云主机失败：获取任务ID失败");
      }

      const taskID = result.data;

      return `新任务${taskID}已启动，开始启动云主机${input.guestID}。可调用mcp-tool:check-task检查执行结果`;
    } catch (error) {
      const output = `启动云主机失败: ${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestStartTool;
