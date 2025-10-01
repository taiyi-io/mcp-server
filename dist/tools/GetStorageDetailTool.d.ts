import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GetStorageDetailInput {
    storagePoolID: string;
}
declare class GetStorageDetailTool extends MCPTool<GetStorageDetailInput> {
    name: string;
    description: string;
    schema: {
        storagePoolID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GetStorageDetailInput): Promise<string>;
}
export default GetStorageDetailTool;
