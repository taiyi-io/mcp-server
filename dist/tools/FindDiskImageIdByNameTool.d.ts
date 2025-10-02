import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface FindDiskImageIdByNameInput {
    name: string;
}
declare class FindDiskImageIdByNameTool extends MCPTool<FindDiskImageIdByNameInput> {
    name: string;
    description: string;
    schema: {
        name: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: FindDiskImageIdByNameInput): Promise<string>;
}
export default FindDiskImageIdByNameTool;
