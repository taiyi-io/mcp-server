import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 最新告警资源
 * 返回最新10条未读告警记录和总数统计
 */
declare class WarningLatestResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default WarningLatestResource;
