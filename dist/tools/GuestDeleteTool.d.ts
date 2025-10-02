import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestDeleteInput {
    guestID: string;
}
declare class GuestDeleteTool extends MCPTool<GuestDeleteInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestDeleteInput): Promise<string>;
}
export default GuestDeleteTool;
