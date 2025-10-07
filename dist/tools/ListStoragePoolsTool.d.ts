import { MCPTool } from "mcp-framework";
declare class ListStoragePoolsTool extends MCPTool {
    name: string;
    description: string;
    schema: {};
    execute(): Promise<string>;
}
export default ListStoragePoolsTool;
