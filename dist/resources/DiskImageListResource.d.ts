import { MCPResource, ResourceContent } from "mcp-framework";
declare class DiskImageListResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default DiskImageListResource;
