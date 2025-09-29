import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface MarkSystemIsoImageInput {
    imageID: string;
}
declare class MarkSystemIsoImageTool extends MCPTool<MarkSystemIsoImageInput> {
    name: string;
    description: string;
    schema: {
        imageID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: MarkSystemIsoImageInput): Promise<string>;
}
export default MarkSystemIsoImageTool;
