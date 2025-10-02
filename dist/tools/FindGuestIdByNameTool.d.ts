import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface FindGuestIdByNameInput {
    name: string;
}
declare class FindGuestIdByNameTool extends MCPTool<FindGuestIdByNameInput> {
    name: string;
    description: string;
    schema: {
        name: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: FindGuestIdByNameInput): Promise<string>;
}
export default FindGuestIdByNameTool;
