import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GetGuestDetailInput {
    guestID: string;
}
declare class GetGuestDetailTool extends MCPTool<GetGuestDetailInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GetGuestDetailInput): Promise<string>;
}
export default GetGuestDetailTool;
