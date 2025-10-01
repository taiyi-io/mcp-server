import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GetSystemDetailInput {
    systemID: string;
}
declare class GetSystemDetailTool extends MCPTool<GetSystemDetailInput> {
    name: string;
    description: string;
    schema: {
        systemID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GetSystemDetailInput): Promise<string>;
}
export default GetSystemDetailTool;
