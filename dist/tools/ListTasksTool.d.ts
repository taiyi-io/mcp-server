import { MCPTool } from "mcp-framework";
declare class ListTasksTool extends MCPTool {
    name: string;
    description: string;
    schema: {};
    execute(): Promise<string>;
}
export default ListTasksTool;
