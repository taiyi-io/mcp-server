import { MCPResource, logger } from "mcp-framework";
import { NodeMode } from "@taiyi-io/api-connector-ts";
import { getConnector } from "../server.js";
/**
 * 节点列表资源
 * 返回当前用户可以访问的所有节点列表
 */
class NodeListResource extends MCPResource {
    uri = "resource://node/";
    name = "节点列表";
    description = "返回当前用户可以访问的所有节点列表，包含节点标识、名称、类型、地址、状态和资源池信息。通常用于查看系统中可用的节点。";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        try {
            const result = await connector.queryNodes();
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("获取节点列表失败：返回数据为空");
            }
            const nodes = result.data;
            const resources = [];
            // 处理节点数据
            if (Array.isArray(nodes)) {
                nodes.forEach((node) => {
                    const nodeData = {};
                    // 映射属性
                    if (node.mode === NodeMode.Control) {
                        nodeData["模式"] = "主控节点";
                    }
                    else if (node.mode === NodeMode.Resource) {
                        nodeData["模式"] = "资源节点";
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
                    if (node.critical !== undefined) {
                        nodeData["致命故障"] = node.critical;
                    }
                    if (node.alert !== undefined) {
                        nodeData["警报"] = node.alert;
                    }
                    if (node.warning !== undefined) {
                        nodeData["告警"] = node.warning;
                    }
                    // 确保在创建URI之前有ID
                    if (node.id !== undefined) {
                        resources.push({
                            uri: `${this.uri}${node.id}`,
                            mimeType: this.mimeType,
                            text: JSON.stringify(nodeData),
                        });
                    }
                    else {
                        logger.warn("发现没有ID的节点，跳过资源创建");
                    }
                });
            }
            else {
                logger.warn("queryNodes返回非数组结果");
            }
            return resources;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
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
