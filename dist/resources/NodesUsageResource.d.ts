import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 节点使用情况资源
 * 返回当前所有节点的使用情况和状态信息
 */
declare class NodesUsageResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default NodesUsageResource;
