import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestRestoreSnapshotInput {
    guestID: string;
    snapshotID: string;
    sync?: boolean;
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
        sync: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
            default: boolean;
        };
    };
    execute(input: GuestRestoreSnapshotInput): Promise<string>;
}
export default GuestRestoreSnapshotTool;
