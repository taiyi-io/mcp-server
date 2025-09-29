import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
class UnmarkSystemDiskImagePrompt extends MCPPrompt {
    name = "unmark-system-disk-image-prompt";
    description = "取消指定名称的磁盘镜像的系统标记";
    schema = {
        imageName: {
            type: z.string(),
            description: "磁盘镜像名称",
            required: true,
        },
    };
    async generateMessages({ imageName }) {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `从resource://disk-image/磁盘镜像列表获取名称为 ${imageName} 的磁盘镜像ID，然后调用mcp:unmark-system-disk-image取消系统标记`,
                },
            },
        ];
    }
}
export default UnmarkSystemDiskImagePrompt;
