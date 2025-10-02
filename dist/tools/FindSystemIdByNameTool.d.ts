import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface FindSystemIdByNameInput {
    name: string;
}
declare class FindSystemIdByNameTool extends MCPTool<FindSystemIdByNameInput> {
    name: string;
    description: string;
    schema: {
        name: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: FindSystemIdByNameInput): Promise<string>;
}
export default FindSystemIdByNameTool;
