import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 系统模板列表资源
 * 返回当前用户可以访问的所有系统模板列表
 */
declare class SystemListResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default SystemListResource;
