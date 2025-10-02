import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { TaiyiConnector } from "@taiyi-io/api-connector-ts";

interface GuestRestoreSnapshotInput {
  guestID: string;
  snapshotID: string;
  sync?: boolean;
}

class GuestRestoreSnapshotTool extends MCPTool<GuestRestoreSnapshotInput> {
  name = "guest-restore-snapshot";
  description = "恢复云主机快照，支持同步等待结果";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
    },
    snapshotID: {
      type: z.string(),
      description: "快照ID。可以从mcp-tool:guest-query-snapshots获取",
    },
    sync: {
      type: z.boolean().optional(),
      description: "是否同步等待结果，默认否",
      default: false,
    },
  };

  async execute(input: GuestRestoreSnapshotInput) {
    try {
      const connector: TaiyiConnector = await getConnector();

      // 调用connector恢复云主机快照
      const result = await connector.tryRestoreSnapshot(
        input.guestID,
        input.snapshotID
      );

      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("恢复快照失败：获取任务ID失败");
      }

      const taskID = result.data;

      // 异步处理情况
      if (!input.sync) {
        return `开始恢复快照，ID：${taskID}，调用mcp-tool:check-task检查执行结果`;
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
      return `云主机${input.guestID}快照恢复成功`;
    } catch (error) {
      const output = `恢复云主机快照失败: ${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestRestoreSnapshotTool;
