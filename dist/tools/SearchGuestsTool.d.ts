import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface SearchGuestsInput {
    keywords: string[];
    selfOnly?: boolean;
}
declare class SearchGuestsTool extends MCPTool<SearchGuestsInput> {
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
    execute(input: SearchGuestsInput): Promise<string>;
}
export default SearchGuestsTool;
