import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestRestoreSnapshotInput {
    guestID: string;
    snapshotID: string;
}
declare class GuestRestoreSnapshotTool extends MCPTool<GuestRestoreSnapshotInput> {
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
    execute(input: GuestRestoreSnapshotInput): Promise<string>;
}
export default GuestRestoreSnapshotTool;
