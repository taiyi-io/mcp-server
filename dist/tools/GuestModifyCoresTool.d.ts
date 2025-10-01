import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestModifyCoresInput {
    guestID: string;
    cores: string;
}
declare class GuestModifyCoresTool extends MCPTool<GuestModifyCoresInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        cores: {
            type: z.ZodEffects<z.ZodString, string, string>;
            description: string;
        };
    };
    execute(input: GuestModifyCoresInput): Promise<string>;
}
export default GuestModifyCoresTool;
