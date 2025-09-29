import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface DeleteIsoImageInput {
    imageID: string;
}
declare class DeleteIsoImageTool extends MCPTool<DeleteIsoImageInput> {
    name: string;
    description: string;
    schema: {
        imageID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: DeleteIsoImageInput): Promise<string>;
}
export default DeleteIsoImageTool;
