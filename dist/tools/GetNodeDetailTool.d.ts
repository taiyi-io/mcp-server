import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GetNodeDetailInput {
    nodeID: string;
}
declare class GetNodeDetailTool extends MCPTool<GetNodeDetailInput> {
    name: string;
    description: string;
    schema: {
        nodeID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GetNodeDetailInput): Promise<string>;
}
export default GetNodeDetailTool;
