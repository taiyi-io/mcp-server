import { MCPPrompt } from "mcp-framework";
import { z } from "zod";
class UnmarkSystemDiskImagePrompt extends MCPPrompt {
    name = "unmarkSystemDiskImagePrompt";
    description = "从资源列表获取磁盘镜像ID后，调用tools取消指定磁盘镜像的系统标记";
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
                    text: `从镜像列表获取名称为 ${imageName} 的磁盘镜像ID，然后调用unmarkSystemDiskImage取消系统标记`,
                },
            },
        ];
    }
}
export default UnmarkSystemDiskImagePrompt;
