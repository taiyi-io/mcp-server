import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface UnmarkSystemIsoImageInput {
    imageID: string;
}
declare class UnmarkSystemIsoImageTool extends MCPTool<UnmarkSystemIsoImageInput> {
    name: string;
    description: string;
    schema: {
        imageID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: UnmarkSystemIsoImageInput): Promise<string>;
}
export default UnmarkSystemIsoImageTool;
