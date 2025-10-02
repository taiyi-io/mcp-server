import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestResetInput {
    guestID: string;
}
declare class GuestResetTool extends MCPTool<GuestResetInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestResetInput): Promise<string>;
}
export default GuestResetTool;
