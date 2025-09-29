import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface UnmarkSystemDiskImageInput {
    imageID: string;
}
declare class UnmarkSystemDiskImageTool extends MCPTool<UnmarkSystemDiskImageInput> {
    name: string;
    description: string;
    schema: {
        imageID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: UnmarkSystemDiskImageInput): Promise<string>;
}
export default UnmarkSystemDiskImageTool;
