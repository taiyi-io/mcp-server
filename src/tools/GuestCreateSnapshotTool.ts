import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { TaiyiConnector } from "@taiyi-io/api-connector-ts";

interface GuestCreateSnapshotInput {
  guestID: string;
  label: string;
  description?: string;
}

class GuestCreateSnapshotTool extends MCPTool<GuestCreateSnapshotInput> {
  name = "guest-create-snapshot";
  description = "创建云主机快照，支持同步等待结果";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
    },
    label: {
      type: z.string(),
      description: "快照名称",
    },
    description: {
      type: z.string().optional(),
      description: "快照描述",
    },
  };

  async execute(input: GuestCreateSnapshotInput) {
    try {
      const connector: TaiyiConnector = await getConnector();

      // 调用connector创建云主机快照，目前description参数不支持，仅使用label
      const result = await connector.tryCreateSnapshot(
        input.guestID,
        input.label
      );

      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("创建快照失败：获取任务ID失败");
      }

      const taskID = result.data;

      // 异步处理情况
      return `新任务${taskID}已启动，创建快照${input.label}。调用mcp-tool:check-task检查执行结果`;
    } catch (error) {
      const output = `创建云主机快照失败: ${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestCreateSnapshotTool;
