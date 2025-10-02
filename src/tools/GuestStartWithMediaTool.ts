import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import {
  TaiyiConnector,
  TaskData,
  TaskStatus,
} from "@taiyi-io/api-connector-ts";

interface GuestStartWithMediaInput {
  guestID: string;
  mediaID: string;
  sync?: boolean;
}

class GuestStartWithMediaTool extends MCPTool<GuestStartWithMediaInput> {
  name = "guest-start-with-media";
  description = "使用ISO镜像引导云主机启动，支持同步等待结果";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
    },
    mediaID: {
      type: z.string(),
      description:
        "ISO镜像ID，如果仅有名称，可以通过mcp-tool:find-iso-image-id-by-name获取ID",
    },
    sync: {
      type: z.boolean().optional(),
      description: "是否同步等待结果，默认否",
      default: false,
    },
  };

  async execute(input: GuestStartWithMediaInput) {
    try {
      const connector: TaiyiConnector = await getConnector();

      // 调用connector使用ISO镜像引导启动云主机
      const result = await connector.tryStartGuest(
        input.guestID,
        input.mediaID
      );

      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("启动云主机失败：获取任务ID失败");
      }

      const taskID = result.data;

      // 异步处理情况
      if (!input.sync) {
        return `开始启动云主机，ID：${taskID}，调用mcp-tool:check-task检查执行结果`;
      }

      // 同步等待结果，等待20分钟，间隔10秒
      const waitTimeout = 10 * 60;
      const waitInterval = 5;
      const taskResult = await connector.waitTask(
        taskID,
        waitTimeout,
        waitInterval
      );
      if (taskResult.error) {
        throw new Error(taskResult.error);
      }
      return `云主机${input.guestID}启动成功`;
    } catch (error) {
      const output = `启动云主机失败: ${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestStartWithMediaTool;
