import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface ModifyIsoImageInput {
    imageID: string;
    name: string;
    description?: string;
    tags?: string[];
}
declare class ModifyIsoImageTool extends MCPTool<ModifyIsoImageInput> {
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
    execute(input: ModifyIsoImageInput): Promise<string>;
}
export default ModifyIsoImageTool;
