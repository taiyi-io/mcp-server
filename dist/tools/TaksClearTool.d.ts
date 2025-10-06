import { MCPTool } from "mcp-framework";
interface TaksClearInput {
}
declare class TaksClearTool extends MCPTool<TaksClearInput> {
    name: string;
    description: string;
    schema: {};
    execute(input: TaksClearInput): Promise<string>;
}
export default TaksClearTool;
