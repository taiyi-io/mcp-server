import { MCPPrompt } from "mcp-framework";
import { PromptArgumentSchema } from "mcp-framework";
interface ChangeDiskImageNameInput {
    currentName: string;
    newName: string;
}
declare class ChangeDiskImageNamePrompt extends MCPPrompt<ChangeDiskImageNameInput> {
    name: string;
    description: string;
    schema: PromptArgumentSchema<ChangeDiskImageNameInput>;
    generateMessages({ currentName, newName }: ChangeDiskImageNameInput): Promise<{
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[]>;
}
export default ChangeDiskImageNamePrompt;
