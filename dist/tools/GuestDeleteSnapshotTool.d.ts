import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestDeleteSnapshotInput {
    guestID: string;
    snapshotID: string;
    sync?: boolean;
}
declare class GuestDeleteSnapshotTool extends MCPTool<GuestDeleteSnapshotInput> {
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
    execute(input: GuestDeleteSnapshotInput): Promise<string>;
}
export default GuestDeleteSnapshotTool;
