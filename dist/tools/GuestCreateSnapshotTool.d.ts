import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestCreateSnapshotInput {
    guestID: string;
    label: string;
    description?: string;
}
declare class GuestCreateSnapshotTool extends MCPTool<GuestCreateSnapshotInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        label: {
            type: z.ZodString;
            description: string;
        };
        description: {
            type: z.ZodOptional<z.ZodString>;
            description: string;
        };
    };
    execute(input: GuestCreateSnapshotInput): Promise<string>;
}
export default GuestCreateSnapshotTool;
