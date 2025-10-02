import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface EjectMediaInput {
    guestID: string;
}
declare class EjectMediaTool extends MCPTool<EjectMediaInput> {
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
export default EjectMediaTool;
