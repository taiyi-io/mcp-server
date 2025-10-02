import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestShutdownInput {
    guestID: string;
}
declare class GuestShutdownTool extends MCPTool<GuestShutdownInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestShutdownInput): Promise<string>;
}
export default GuestShutdownTool;
