import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 集群使用情况资源
 * 返回当前集群的整体使用情况和状态信息
 */
declare class ClusterUsageResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default ClusterUsageResource;
