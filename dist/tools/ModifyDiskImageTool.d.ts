import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface ModifyDiskImageInput {
    imageID: string;
    name: string;
    description?: string;
    tags?: string[];
}
declare class ModifyDiskImageTool extends MCPTool<ModifyDiskImageInput> {
    name: string;
    description: string;
    schema: {
        imageID: {
            type: z.ZodString;
            description: string;
        };
        name: {
            type: z.ZodString;
            description: string;
        };
        description: {
            type: z.ZodOptional<z.ZodString>;
            description: string;
        };
        tags: {
            type: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            description: string;
        };
    };
    execute(input: ModifyDiskImageInput): Promise<string>;
}
export default ModifyDiskImageTool;
