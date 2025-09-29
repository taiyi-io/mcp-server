import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
class ChangeDiskImageNamePrompt extends MCPPrompt {
    name = "change-disk-image-name";
    description = "修改磁盘镜像的名称";
    schema = {
        currentName: {
            type: z.string(),
            description: "磁盘镜像的当前名称",
            required: true,
        },
        newName: {
            type: z.string().nonempty(),
            description: "磁盘镜像的新名称（必填非空）",
            required: true,
        },
    };
    async generateMessages({ currentName, newName }) {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `从resource://disk-image/磁盘镜像列表获取名称为 ${currentName} 的磁盘镜像ID，然后调用mcp:modify-disk-image修改该磁盘镜像的名称为 ${newName}`,
                },
            },
        ];
    }
}
export default ChangeDiskImageNamePrompt;
