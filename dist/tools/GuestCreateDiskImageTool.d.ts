import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { ResourceAccessLevel } from "@taiyi-io/api-connector-ts";
interface CreateDiskImageInput {
    guestID: string;
    imageName: string;
    imageDescription?: string;
    access_level: ResourceAccessLevel;
}
declare class GuestCreateDiskImageTool extends MCPTool<CreateDiskImageInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        imageName: {
            type: z.ZodString;
            description: string;
        };
        access_level: {
            type: z.ZodNativeEnum<typeof ResourceAccessLevel>;
            description: string;
            default: ResourceAccessLevel;
        };
        imageDescription: {
            type: z.ZodOptional<z.ZodString>;
            description: string;
        };
    };
    execute(input: CreateDiskImageInput): Promise<string>;
}
export default GuestCreateDiskImageTool;
