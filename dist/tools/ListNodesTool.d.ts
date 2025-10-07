import { MCPTool } from "mcp-framework";
declare class ListNodesTool extends MCPTool {
    name: string;
    description: string;
    schema: {};
    execute(): Promise<string>;
}
export default ListNodesTool;
