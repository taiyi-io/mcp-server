import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface ListDiskImagesInput {
    selfOnly?: boolean;
}
declare class ListDiskImagesTool extends MCPTool<ListDiskImagesInput> {
    name: string;
    description: string;
    schema: {
        selfOnly: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
    };
    execute(input: ListDiskImagesInput): Promise<string>;
}
export default ListDiskImagesTool;
