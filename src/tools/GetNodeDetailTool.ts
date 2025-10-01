import {
  ClusterNodeData,
  NodeMode,
  NodeState,
  TaiyiConnector,
} from "@taiyi-io/api-connector-ts";
import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

function marshalNodeData(node: ClusterNodeData): string {
  const nodeData: Record<string, any> = {};

  // 映射属性
  if (node.mode === NodeMode.Control) {
    nodeData["模式"] = "主控节点";
  } else if (node.mode === NodeMode.Resource) {
    nodeData["模式"] = "资源节点";
  }
  // 映射节点状态
  switch (node.state) {
    case NodeState.Connected:
      nodeData["运行状态"] = "已连接";
      break;
    case NodeState.Disconnected:
      nodeData["运行状态"] = "已断开";
      break;
    case NodeState.Ready:
      nodeData["运行状态"] = "已就绪";
      break;
    case NodeState.Lost:
      nodeData["运行状态"] = "已丢失";
      break;
  }

  if (node.id !== undefined) {
    nodeData["标识"] = node.id;
  }

  if (node.name !== undefined) {
    nodeData["名称"] = node.name;
  }

  if (node.host && node.port) {
    nodeData["服务地址"] = `${node.host}:${node.port}`;
  }

  if (node.pool !== undefined) {
    nodeData["所属资源池"] = node.pool;
  }

  if (node.disabled === true) {
    nodeData["已禁用"] = true;
  }
  if (node.version) {
    nodeData["版本"] = node.version;
  }
  if (node.upgradable) {
    nodeData["可升级"] = node.upgradable;
  }
  if (node.memory_merged !== undefined) {
    nodeData["合并内存"] = node.memory_merged;
  }
  nodeData["云主机容量"] = node.guests;
  nodeData["最大核心数"] = node.cores;
  nodeData["最大内存"] = `${node.memory}MB`;
  // 将MB转换为GB并保留两位小数
  const diskInGB = (node.disk / 1024).toFixed(2);
  nodeData["最大磁盘"] = `${diskInGB}GB`;
  nodeData[
    "故障"
  ] = `致命${node.critical}, 警报${node.alert}, 告警${node.warning}`;
  return JSON.stringify(nodeData);
}

interface GetNodeDetailInput {
  nodeID: string;
}

class GetNodeDetailTool extends MCPTool<GetNodeDetailInput> {
  name = "get-node-detail";
  description =
    "根据指定id获取节点详情，包含标识、名称、模式、服务地址、所属资源池、运行状态、版本、资源容量、故障数量等，通常用于判断节点负载情况和业务压力";

  schema = {
    nodeID: {
      type: z.string(),
      description: "节点的ID",
    },
  };

  async execute(input: GetNodeDetailInput) {
    try {
      const connector: TaiyiConnector = await getConnector();
      const result = await connector.getNode(input.nodeID);
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("未找到节点数据");
      }
      const node: ClusterNodeData = result.data;
      const text = marshalNodeData(node);
      return text;
    } catch (error) {
      const output = `获取节点 ${input.nodeID} 详情失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GetNodeDetailTool;
