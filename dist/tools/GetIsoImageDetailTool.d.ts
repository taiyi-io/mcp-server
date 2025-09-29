import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GetIsoImageDetailInput {
    imageID: string;
}
declare class GetIsoImageDetailTool extends MCPTool<GetIsoImageDetailInput> {
    name: string;
    description: string;
    schema: {
        imageID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GetIsoImageDetailInput): Promise<string>;
}
export default GetIsoImageDetailTool;
