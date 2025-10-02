import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestStartInput {
    guestID: string;
    sync?: boolean;
}
declare class GuestStartTool extends MCPTool<GuestStartInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        sync: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
    };
    execute(input: GuestStartInput): Promise<string>;
}
export default GuestStartTool;
