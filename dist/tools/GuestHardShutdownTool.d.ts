import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestHardShutdownInput {
    guestID: string;
}
declare class GuestHardShutdownTool extends MCPTool<GuestHardShutdownInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestHardShutdownInput): Promise<string>;
}
export default GuestHardShutdownTool;
