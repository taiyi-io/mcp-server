import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 存储资源池列表资源
 * 返回当前用户可以访问的所有存储资源池列表
 */
declare class StoragePoolResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default StoragePoolResource;
