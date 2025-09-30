import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 最新日志资源
 * 返回最新10条日志记录
 */
declare class LogLatestResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default LogLatestResource;
