import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface InstallDiskImageInput {
    guestID: string;
    diskImageID: string;
}
declare class GuestInstallDiskImageTool extends MCPTool<InstallDiskImageInput> {
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
    };
    execute(input: InstallDiskImageInput): Promise<string>;
}
export default GuestInstallDiskImageTool;
