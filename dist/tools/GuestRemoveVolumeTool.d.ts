import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestRemoveVolumeInput {
    guestID: string;
    tag: string;
}
declare class GuestRemoveVolumeTool extends MCPTool<GuestRemoveVolumeInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        tag: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestRemoveVolumeInput): Promise<string>;
}
export default GuestRemoveVolumeTool;
