import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestStartInput {
    guestID: string;
}
declare class GuestStartTool extends MCPTool<GuestStartInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestStartInput): Promise<string>;
}
export default GuestStartTool;
