import { MCPPrompt, PromptArgumentSchema } from "mcp-framework";
interface MarkSystemDiskImagePromptInput {
    imageName: string;
}
declare class MarkSystemDiskImagePrompt extends MCPPrompt<MarkSystemDiskImagePromptInput> {
    name: string;
    description: string;
    schema: PromptArgumentSchema<MarkSystemDiskImagePromptInput>;
    generateMessages({ imageName }: MarkSystemDiskImagePromptInput): Promise<{
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[]>;
}
export default MarkSystemDiskImagePrompt;
