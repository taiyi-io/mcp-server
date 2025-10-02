import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestRebootInput {
    guestID: string;
}
declare class GuestRebootTool extends MCPTool<GuestRebootInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestRebootInput): Promise<string>;
}
export default GuestRebootTool;
