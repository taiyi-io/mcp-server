import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface InstallDiskImageInput {
    guestID: string;
    diskImageID: string;
    sync: boolean;
}
declare class InstallDiskImageTool extends MCPTool<InstallDiskImageInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        diskImageID: {
            type: z.ZodString;
            description: string;
        };
        sync: {
            type: z.ZodBoolean;
            description: string;
            default: boolean;
        };
    };
    execute(input: InstallDiskImageInput): Promise<string>;
}
export default InstallDiskImageTool;
