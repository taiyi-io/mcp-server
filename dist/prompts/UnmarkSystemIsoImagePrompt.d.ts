import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
interface UnmarkSystemIsoImageInput {
    imageName: string;
}
declare class UnmarkSystemIsoImagePrompt extends MCPPrompt<UnmarkSystemIsoImageInput> {
    name: string;
    description: string;
    schema: {
        imageName: {
            type: z.ZodString;
            description: string;
            required: boolean;
        };
    };
    generateMessages({ imageName }: UnmarkSystemIsoImageInput): Promise<{
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[]>;
}
export default UnmarkSystemIsoImagePrompt;
