import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 节点列表资源
 * 返回当前用户可以访问的所有节点列表
 */
declare class NodeListResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default NodeListResource;
