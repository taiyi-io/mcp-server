import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { TaiyiConnector } from "@taiyi-io/api-connector-ts";

interface GuestRestoreSnapshotInput {
  guestID: string;
  snapshotID: string;
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
      return `新任务${taskID}已启动，恢复快照${input.snapshotID}到云主机${input.guestID}。可调用mcp-tool:check-task检查执行结果`;
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
