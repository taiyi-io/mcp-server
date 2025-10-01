import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GetComputePoolDetailInput {
    poolID: string;
}
declare class GetComputePoolDetailTool extends MCPTool<GetComputePoolDetailInput> {
    name: string;
    description: string;
    schema: {
        poolID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GetComputePoolDetailInput): Promise<string>;
}
export default GetComputePoolDetailTool;
