import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestModifyMemoryInput {
    guestID: string;
    memoryMB: string;
}
declare class GuestModifyMemoryTool extends MCPTool<GuestModifyMemoryInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        memoryMB: {
            type: z.ZodEffects<z.ZodString, string, string>;
            description: string;
        };
    };
    execute(input: GuestModifyMemoryInput): Promise<string>;
}
export default GuestModifyMemoryTool;
