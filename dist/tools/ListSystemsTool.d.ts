import { MCPTool } from "mcp-framework";
import z from "zod";
interface ListSystemsInput {
    selfOnly?: boolean;
}
declare class ListSystemsTool extends MCPTool<ListSystemsInput> {
    name: string;
    description: string;
    schema: {
        selfOnly: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
    };
    execute(input: ListSystemsInput): Promise<string>;
}
export default ListSystemsTool;
