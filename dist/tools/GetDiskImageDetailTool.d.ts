import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GetDiskImageDetailInput {
    imageID: string;
}
declare class GetDiskImageDetailTool extends MCPTool<GetDiskImageDetailInput> {
    name: string;
    description: string;
    schema: {
        imageID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GetDiskImageDetailInput): Promise<string>;
}
export default GetDiskImageDetailTool;
