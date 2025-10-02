import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestGetSnapshotInput {
    guestID: string;
    snapshotID: string;
}
declare class GuestGetSnapshotTool extends MCPTool<GuestGetSnapshotInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        snapshotID: {
            type: z.ZodString;
            description: string;
        };
    };
    execute(input: GuestGetSnapshotInput): Promise<string>;
}
export default GuestGetSnapshotTool;
