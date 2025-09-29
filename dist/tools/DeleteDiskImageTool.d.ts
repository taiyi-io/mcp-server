import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface DeleteDiskImageInput {
    imageID: string;
}
declare class DeleteDiskImageTool extends MCPTool<DeleteDiskImageInput> {
    name: string;
    description: string;
    schema: {
        imageID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: DeleteDiskImageInput): Promise<string>;
}
export default DeleteDiskImageTool;
