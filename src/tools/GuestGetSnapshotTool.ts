import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { TaiyiConnector, SnapshotRecord } from "@taiyi-io/api-connector-ts";

function marshalSnapshotData(snapshot: SnapshotRecord): string {
  const snapshotData: Record<string, any> = {};

  // 映射字段
  if (snapshot.id !== undefined) {
    snapshotData["标识"] = snapshot.id;
  }
  if (snapshot.label !== undefined) {
    snapshotData["名称"] = snapshot.label;
  }
  if (snapshot.created_time !== undefined) {
    snapshotData["创建时间"] = new Date(snapshot.created_time).toISOString();
  }
  if (snapshot.running !== undefined) {
    snapshotData["实时快照"] = snapshot.running;
  }
  if (snapshot.current !== undefined) {
    snapshotData["当前快照"] = snapshot.current;
  }
  if (snapshot.description !== undefined) {
    snapshotData["描述"] = snapshot.description;
  }
  return JSON.stringify(snapshotData);
}

interface GuestGetSnapshotInput {
  guestID: string;
  snapshotID: string;
}

class GuestGetSnapshotTool extends MCPTool<GuestGetSnapshotInput> {
  name = "guest-get-snapshot";
  description =
    "根据指定ID获取云主机快照详情，包含标识、名称、创建时间、实时快照、当前快照、描述等信息";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
    },
    snapshotID: {
      type: z.string(),
      description: "快照ID，可以从mcp-tool:guest-query-snapshots获取",
    },
  };

  async execute(input: GuestGetSnapshotInput) {
    try {
      const connector: TaiyiConnector = await getConnector();
      const result = await connector.getSnapshot(
        input.guestID,
        input.snapshotID
      );
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("未找到快照数据");
      }
      const snapshot: SnapshotRecord = result.data;
      const text = marshalSnapshotData(snapshot);
      return text;
    } catch (error) {
      const output = `获取云主机 ${input.guestID} 快照 ${
        input.snapshotID
      } 详情失败：${error instanceof Error ? error.message : String(error)}`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestGetSnapshotTool;
