import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestQuerySnapshotsInput {
    guestID: string;
}
declare class GuestQuerySnapshotsTool extends MCPTool<GuestQuerySnapshotsInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestQuerySnapshotsInput): Promise<string>;
}
export default GuestQuerySnapshotsTool;
