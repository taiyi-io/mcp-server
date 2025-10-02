import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestStartWithMediaInput {
    guestID: string;
    mediaID: string;
    sync?: boolean;
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
        sync: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
    };
    execute(input: GuestStartWithMediaInput): Promise<string>;
}
export default GuestStartWithMediaTool;
