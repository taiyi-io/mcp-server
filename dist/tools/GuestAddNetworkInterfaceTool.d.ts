import { MCPTool } from "mcp-framework";
import { z } from "zod";
interface GuestAddNetworkInterfaceInput {
    guestID: string;
    macAddress?: string;
    external?: boolean;
}
declare class GuestAddNetworkInterfaceTool extends MCPTool<GuestAddNetworkInterfaceInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        macAddress: {
            type: z.ZodOptional<z.ZodString>;
            description: string;
        };
        external: {
            type: z.ZodOptional<z.ZodBoolean>;
            description: string;
        };
    };
    execute(input: GuestAddNetworkInterfaceInput): Promise<string>;
}
export default GuestAddNetworkInterfaceTool;
