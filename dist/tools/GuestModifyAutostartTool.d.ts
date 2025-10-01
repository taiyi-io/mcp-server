import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestModifyAutostartInput {
    guestID: string;
    enable?: boolean;
}
declare class GuestModifyAutostartTool extends MCPTool<GuestModifyAutostartInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        enable: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
        };
    };
    execute(input: GuestModifyAutostartInput): Promise<string>;
}
export default GuestModifyAutostartTool;
