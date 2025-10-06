import { MCPTool } from "mcp-framework";
declare class TaskClearTool extends MCPTool {
    name: string;
    description: string;
    schema: {};
    execute(): Promise<string>;
}
export default TaskClearTool;
