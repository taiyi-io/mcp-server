import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface SearchSystemsInput {
    keywords: string[];
    selfOnly?: boolean;
}
declare class SearchSystemsTool extends MCPTool<SearchSystemsInput> {
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
    execute(input: SearchSystemsInput): Promise<string>;
}
export default SearchSystemsTool;
