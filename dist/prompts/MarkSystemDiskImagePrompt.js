import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
class MarkSystemDiskImagePrompt extends MCPPrompt {
    name = "markSystemDiskImagePrompt";
    description = "从资源列表获取磁盘镜像ID后,调用tools将指定的磁盘镜像标记为系统磁盘镜像";
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
                    text: `从镜像列表获取名称为 ${imageName} 的磁盘镜像ID，然后调用markSystemDiskImage标记为系统镜像`,
                },
            },
        ];
    }
}
export default MarkSystemDiskImagePrompt;
