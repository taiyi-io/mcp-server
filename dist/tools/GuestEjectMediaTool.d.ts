import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface EjectMediaInput {
    guestID: string;
}
declare class GuestEjectMediaTool extends MCPTool<EjectMediaInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: EjectMediaInput): Promise<string>;
}
export default GuestEjectMediaTool;
