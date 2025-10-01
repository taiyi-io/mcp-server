import { MCPResource, ResourceContent, logger } from "mcp-framework";
import {
  NodeResourceSnapshot,
  TaiyiConnector,
  ClusterNodeData,
} from "@taiyi-io/api-connector-ts";
import { getConnector } from "../server.js";
import { marshalDiskSpeed, marshalNetworkSpeed } from "../utils.js";

/**
 * 将NodeResourceSnapshot对象转换为JSON字符串
 */
function marshalNodeUsage(snapshot: NodeResourceSnapshot): string {
  const obj: { [key: string]: any } = {};

  // 节点基本信息
  obj["标识"] = snapshot.node_id;

  // 云主机信息
  obj[
    "云主机"
  ] = `运行 ${snapshot.guest_running} /停止 ${snapshot.guest_stopped} /未知 ${snapshot.guest_unkown}`;

  // 核心利用率
  if (snapshot.core_usage !== undefined && snapshot.cores !== undefined) {
    const usedCores = parseFloat(
      ((snapshot.core_usage * snapshot.cores) / 100).toFixed(2)
    );
    obj["核心利用率"] = `${usedCores} / ${snapshot.cores}`;
  }

  // 内存利用率
  if (snapshot.memory_used !== undefined && snapshot.memory !== undefined) {
    obj["内存利用率"] = `${snapshot.memory_used} / ${snapshot.memory} MB 已用`;
  }

  // 磁盘利用率
  if (snapshot.disk_used !== undefined && snapshot.disk !== undefined) {
    const diskUsedGB = parseFloat((snapshot.disk_used / 1024).toFixed(2));
    const diskTotalGB = Math.floor(snapshot.disk / 1024);
    obj["磁盘利用率"] = `${diskUsedGB} / ${diskTotalGB} GB`;
  }

  // 状态信息
  obj[
    "状态"
  ] = `致命故障 ${snapshot.critical}, 报警 ${snapshot.alert}, 警告 ${snapshot.warning}`;

  obj["磁盘速度"] = marshalDiskSpeed(
    snapshot.read_bytes_per_second,
    snapshot.write_bytes_per_second
  );
  obj["网络带宽"] = marshalNetworkSpeed(
    snapshot.received_bytes_per_second,
    snapshot.transmitted_bytes_per_second
  );

  // 时间戳
  if (snapshot.timestamp) {
    obj["更新时间"] = new Date(snapshot.timestamp).toLocaleString();
  }

  return JSON.stringify(obj);
}

/**
 * 节点使用情况资源
 * 返回当前所有节点的使用情况和状态信息
 */
class NodesUsageResource extends MCPResource {
  uri = "resource://nodes-usage";
  name = "节点资源用量";
  description =
    "返回当前所有节点的使用情况和状态信息，包含云主机状态、核心利用率、内存利用率、磁盘利用率、网络情况和系统状态。";
  mimeType = "application/json";

  async read(): Promise<ResourceContent[]> {
    const connector: TaiyiConnector = await getConnector();
    try {
      // 先调用queryNodes获取节点id列表
      const nodesResult = await connector.queryNodes();
      if (nodesResult.error) {
        throw new Error(nodesResult.error);
      } else if (!nodesResult.data) {
        throw new Error("获取节点列表失败：返回数据为空");
      }

      const nodes: ClusterNodeData[] = nodesResult.data;
      const nodeIds: string[] = nodes.map((node) => node.id);

      // 调用queryNodesUsage获取NodeResourceSnapshot
      const nodesUsageResult = await connector.queryNodesUsage(nodeIds);
      if (nodesUsageResult.error) {
        throw new Error(nodesUsageResult.error);
      } else if (!nodesUsageResult.data) {
        throw new Error("获取节点使用情况失败：返回数据为空");
      }

      const nodesUsage: NodeResourceSnapshot[] = nodesUsageResult.data;

      // 构建返回多个resource对象
      const resourcesList: ResourceContent[] = nodesUsage.map((nodeUsage) => {
        const nodeUri = `${this.uri}/${nodeUsage.node_id}`;
        const text = marshalNodeUsage(nodeUsage);
        return {
          uri: nodeUri,
          mimeType: "application/json",
          text: text,
        };
      });

      return resourcesList;
    } catch (error) {
      const output = `获取节点使用情况失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return [
        {
          uri: "",
          mimeType: "text/plain",
          text: output,
        },
      ];
    }
  }
}

export default NodesUsageResource;
