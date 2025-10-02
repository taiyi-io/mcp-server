import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { TaiyiConnector, SnapshotTreeNode } from "@taiyi-io/api-connector-ts";

function marshalSnapshotsData(snapshots: SnapshotTreeNode[]): string {
  const result: Record<string, any>[] = [];

  snapshots.forEach((snapshotNode) => {
    const snapshotData: Record<string, any> = {};

    // 映射字段
    snapshotData["标识"] = snapshotNode.id;
    snapshotData["名称"] = snapshotNode.label;
    if (snapshotNode.running) {
      snapshotData["实时快照"] = snapshotNode.running;
    }
    if (snapshotNode.current) {
      snapshotData["当前快照"] = snapshotNode.current;
    }

    result.push(snapshotData);
  });

  return JSON.stringify(result);
}

interface GuestQuerySnapshotsInput {
  guestID: string;
}

class GuestQuerySnapshotsTool extends MCPTool<GuestQuerySnapshotsInput> {
  name = "guest-query-snapshots";
  description =
    "查询指定云主机的所有快照信息，包含标识、名称、创建时间、实时快照、描述等信息";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
    },
  };

  async execute(input: GuestQuerySnapshotsInput) {
    try {
      const connector: TaiyiConnector = await getConnector();
      const result = await connector.querySnapshots(input.guestID);
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("未找到快照数据");
      }
      const snapshots: SnapshotTreeNode[] = result.data;
      const text = marshalSnapshotsData(snapshots);
      return text;
    } catch (error) {
      const output = `查询云主机 ${input.guestID} 快照信息失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestQuerySnapshotsTool;
