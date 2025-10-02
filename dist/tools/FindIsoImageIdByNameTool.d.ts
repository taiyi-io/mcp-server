import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface FindIsoImageIdByNameInput {
    name: string;
}
declare class FindIsoImageIdByNameTool extends MCPTool<FindIsoImageIdByNameInput> {
    name: string;
    description: string;
    schema: {
        name: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: FindIsoImageIdByNameInput): Promise<string>;
}
export default FindIsoImageIdByNameTool;
