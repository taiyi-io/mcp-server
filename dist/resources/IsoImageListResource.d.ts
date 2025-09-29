import { MCPResource, ResourceContent } from "mcp-framework";
declare class IsoImageResourceList extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
}
export default IsoImageResourceList;
