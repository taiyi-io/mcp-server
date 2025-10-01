import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestAddVolumeInput {
    guestID: string;
    sizeInGB: string;
}
declare class GuestAddVolumeTool extends MCPTool<GuestAddVolumeInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        sizeInGB: {
            type: z.ZodEffects<z.ZodString, string, string>;
            description: string;
        };
    };
    execute(input: GuestAddVolumeInput): Promise<string>;
}
export default GuestAddVolumeTool;
