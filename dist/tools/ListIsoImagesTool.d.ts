import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface ListIsoImagesInput {
    selfOnly?: boolean;
}
declare class ListIsoImagesTool extends MCPTool<ListIsoImagesInput> {
    name: string;
    description: string;
    schema: {
        selfOnly: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
    };
    execute(input: ListIsoImagesInput): Promise<string>;
}
export default ListIsoImagesTool;
