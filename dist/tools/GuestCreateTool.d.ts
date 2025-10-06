import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { ResourceAccessLevel } from "@taiyi-io/api-connector-ts";
interface GuestCreateInput {
    poolID: string;
    system?: string;
    name: string;
    cores: string;
    memory: string;
    disks: string;
    source_image?: string;
    auto_start?: boolean;
    cloud_init?: boolean;
    access_level: ResourceAccessLevel;
}
declare class GuestCreateTool extends MCPTool<GuestCreateInput> {
    name: string;
    description: string;
    schema: {
        poolID: {
            type: z.ZodString;
            description: string;
        };
        system: {
            type: z.ZodOptional<z.ZodString>;
            description: string;
        };
        name: {
            type: z.ZodString;
            description: string;
        };
        cores: {
            type: z.ZodString;
            description: string;
        };
        memory: {
            type: z.ZodString;
            description: string;
        };
        disks: {
            type: z.ZodString;
            description: string;
        };
        source_image: {
            type: z.ZodOptional<z.ZodString>;
            description: string;
        };
        auto_start: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
        cloud_init: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
        access_level: {
            type: z.ZodNativeEnum<typeof ResourceAccessLevel>;
            description: string;
            default: ResourceAccessLevel;
        };
    };
    execute(input: GuestCreateInput): Promise<string>;
}
export default GuestCreateTool;
