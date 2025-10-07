import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface SearchIsoImagesInput {
    keywords: string[];
    selfOnly?: boolean;
}
declare class SearchIsoImagesTool extends MCPTool<SearchIsoImagesInput> {
    name: string;
    description: string;
    schema: {
        keywords: {
            type: z.ZodArray<z.ZodString, "atleastone">;
            description: string;
        };
        selfOnly: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
    };
    execute(input: SearchIsoImagesInput): Promise<string>;
}
export default SearchIsoImagesTool;
