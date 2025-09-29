import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
interface MarkSystemIsoImageInput {
    imageName: string;
}
declare class MarkSystemIsoImagePrompt extends MCPPrompt<MarkSystemIsoImageInput> {
    name: string;
    description: string;
    schema: {
        imageName: {
            type: z.ZodString;
            description: string;
            required: boolean;
        };
    };
    generateMessages({ imageName }: MarkSystemIsoImageInput): Promise<{
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[]>;
}
export default MarkSystemIsoImagePrompt;
