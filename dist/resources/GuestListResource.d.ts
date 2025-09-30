import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 云主机列表资源
 * 返回当前用户可以访问的所有云主机列表
 */
declare class GuestListResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default GuestListResource;
