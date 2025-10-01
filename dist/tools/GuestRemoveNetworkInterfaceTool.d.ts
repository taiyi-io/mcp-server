import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestRemoveNetworkInterfaceInput {
    guestID: string;
    macAddress: string;
    external?: boolean;
}
declare class GuestRemoveNetworkInterfaceTool extends MCPTool<GuestRemoveNetworkInterfaceInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        macAddress: {
            type: z.ZodString;
            description: string;
        };
        external: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
        };
    };
    execute(input: GuestRemoveNetworkInterfaceInput): Promise<string>;
}
export default GuestRemoveNetworkInterfaceTool;
