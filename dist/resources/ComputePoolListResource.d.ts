import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 计算资源池列表资源
 * 返回当前用户可以访问的所有计算资源池列表
 */
declare class ComputePoolListResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default ComputePoolListResource;
