import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 资源池使用情况资源
 * 返回当前所有计算资源池的使用情况和状态信息
 */
declare class PoolsUsageResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default PoolsUsageResource;
