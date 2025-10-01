import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestModifyHostnameInput {
    guestID: string;
    hostname: string;
}
declare class GuestModifyHostnameTool extends MCPTool<GuestModifyHostnameInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        hostname: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestModifyHostnameInput): Promise<string>;
}
export default GuestModifyHostnameTool;
