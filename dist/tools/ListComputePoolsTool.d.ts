import { MCPTool } from "mcp-framework";
declare class ListComputePoolsTool extends MCPTool {
    name: string;
    description: string;
    schema: {};
    execute(): Promise<string>;
}
export default ListComputePoolsTool;
