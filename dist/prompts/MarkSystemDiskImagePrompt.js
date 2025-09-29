import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
class MarkSystemDiskImagePrompt extends MCPPrompt {
    name = "mark-system-disk-image-prompt";
    description = "将指定名称的磁盘镜像标记为系统磁盘镜像";
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
                    text: `从resource://disk-image/磁盘镜像列表获取名称为 ${imageName} 的磁盘镜像ID，然后调用mcp:mark-system-disk-image标记为系统镜像`,
                },
            },
        ];
    }
}
export default MarkSystemDiskImagePrompt;
