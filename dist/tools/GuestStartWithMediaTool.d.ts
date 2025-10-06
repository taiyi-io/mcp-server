import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestStartWithMediaInput {
    guestID: string;
    mediaID: string;
}
declare class GuestStartWithMediaTool extends MCPTool<GuestStartWithMediaInput> {
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
    execute(input: GuestStartWithMediaInput): Promise<string>;
}
export default GuestStartWithMediaTool;
