import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestResetMonitorInput {
    guestID: string;
}
declare class GuestResetMonitorTool extends MCPTool<GuestResetMonitorInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestResetMonitorInput): Promise<string>;
}
export default GuestResetMonitorTool;
