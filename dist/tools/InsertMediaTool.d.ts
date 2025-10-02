import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface InsertMediaInput {
    guestID: string;
    mediaID: string;
}
declare class InsertMediaTool extends MCPTool<InsertMediaInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        mediaID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: InsertMediaInput): Promise<string>;
}
export default InsertMediaTool;
