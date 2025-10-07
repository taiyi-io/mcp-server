import { MCPResource, ResourceContent, logger } from "mcp-framework";
import {
  ClusterNodeData,
  NodeMode,
  TaiyiConnector,
} from "@taiyi-io/api-connector-ts";
import { getConnector } from "../server.js";
import { marshalNodeData } from "../utils.js";

/**
 * 节点列表资源
 * 返回当前用户可以访问的所有节点列表
 */
class NodeListResource extends MCPResource {
  uri = "resource://node/";
  name = "节点列表";
  description =
    "返回当前用户可以访问的所有节点列表，包含节点标识、名称、类型、地址、状态和资源池信息。通常用于查看系统中可用的节点。";
  mimeType = "application/json";

  async read(): Promise<ResourceContent[]> {
    const connector: TaiyiConnector = await getConnector();
    try {
      const result = await connector.queryNodes();
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("获取节点列表失败：返回数据为空");
      }
      const nodes = result.data;

      const resources: ResourceContent[] = [];

      nodes.forEach((node) => {
        if (!node.id) {
          throw new Error("节点数据中缺少ID");
        }
        resources.push({
          uri: `${this.uri}${node.id}`,
          mimeType: this.mimeType,
          text: marshalNodeData(node),
        });
      });

      return resources;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(`读取节点列表资源时发生错误: ${errorMessage}`);
      return [
        {
          uri: "",
          mimeType: "text/plain",
          text: errorMessage,
        },
      ];
    }
  }
}

export default NodeListResource;
