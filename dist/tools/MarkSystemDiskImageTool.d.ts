import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface MarkSystemDiskImageInput {
    imageID: string;
}
declare class MarkSystemDiskImageTool extends MCPTool<MarkSystemDiskImageInput> {
    name: string;
    description: string;
    schema: {
        imageID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: MarkSystemDiskImageInput): Promise<string>;
}
export default MarkSystemDiskImageTool;
