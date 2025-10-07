import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { GuestState } from "@taiyi-io/api-connector-ts";
interface ListGuestsInput {
    selfOnly?: boolean;
    keywords?: string[];
    pool?: string;
    node?: string;
    state?: GuestState;
}
declare class ListGuestsTool extends MCPTool<ListGuestsInput> {
    name: string;
    description: string;
    schema: {
        selfOnly: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
        keywords: {
            type: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            description: string;
            default: never[];
        };
        pool: {
            type: z.ZodOptional<z.ZodString>;
            description: string;
        };
        node: {
            type: z.ZodOptional<z.ZodString>;
            description: string;
        };
        state: {
            type: z.ZodOptional<z.ZodString>;
            description: string;
        };
    };
    execute(input: ListGuestsInput): Promise<string>;
}
export default ListGuestsTool;
