import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface CheckTaskInput {
    taskID: string;
}
declare class CheckTaskTool extends MCPTool<CheckTaskInput> {
    name: string;
    description: string;
    schema: {
        taskID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: CheckTaskInput): Promise<string>;
}
export default CheckTaskTool;
