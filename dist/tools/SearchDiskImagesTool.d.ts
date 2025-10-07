import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface SearchDiskImagesInput {
    keywords: string[];
    selfOnly?: boolean;
}
declare class SearchDiskImagesTool extends MCPTool<SearchDiskImagesInput> {
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
    execute(input: SearchDiskImagesInput): Promise<string>;
}
export default SearchDiskImagesTool;
