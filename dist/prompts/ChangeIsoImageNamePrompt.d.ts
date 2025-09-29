import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
interface ChangeIsoImageNameInput {
    currentName: string;
    newName: string;
}
declare class ChangeIsoImageNamePrompt extends MCPPrompt<ChangeIsoImageNameInput> {
    name: string;
    description: string;
    schema: {
        currentName: {
            type: z.ZodString;
            description: string;
            required: boolean;
        };
        newName: {
            type: z.ZodString;
            description: string;
            required: boolean;
        };
    };
    generateMessages({ currentName, newName }: ChangeIsoImageNameInput): Promise<{
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[]>;
}
export default ChangeIsoImageNamePrompt;
