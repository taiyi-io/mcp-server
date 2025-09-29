import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
class UnmarkSystemIsoImagePrompt extends MCPPrompt {
    name = "unmark-system-iso-image";
    description = "取消指定名称的ISO镜像的系统标记";
    schema = {
        imageName: {
            type: z.string(),
            description: "ISO镜像名称",
            required: true,
        },
    };
    async generateMessages({ imageName }) {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `从resource://iso-image/iso镜像列表获取名称为 ${imageName} 的ISO镜像ID，然后调用mcp:unmark-system-iso-image取消系统标记`,
                },
            },
        ];
    }
}
export default UnmarkSystemIsoImagePrompt;
