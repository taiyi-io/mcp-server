import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
interface UnmarkSystemDiskImagePromptInput {
    imageName: string;
}
declare class UnmarkSystemDiskImagePrompt extends MCPPrompt<UnmarkSystemDiskImagePromptInput> {
    name: string;
    description: string;
    schema: {
        imageName: {
            type: z.ZodString;
            description: string;
            required: boolean;
        };
    };
    generateMessages({ imageName }: UnmarkSystemDiskImagePromptInput): Promise<{
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[]>;
}
export default UnmarkSystemDiskImagePrompt;
