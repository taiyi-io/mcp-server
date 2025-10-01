import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GetGuestRealtimeUsageInput {
    guestID: string;
}
declare class GetGuestRealtimeUsageTool extends MCPTool<GetGuestRealtimeUsageInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GetGuestRealtimeUsageInput): Promise<string>;
}
export default GetGuestRealtimeUsageTool;
