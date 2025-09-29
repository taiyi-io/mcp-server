import { MCPPrompt, PromptArgumentSchema } from "mcp-framework";
import { z } from "zod";

interface MarkSystemDiskImagePromptInput {
  imageName: string;
}

class MarkSystemDiskImagePrompt extends MCPPrompt<MarkSystemDiskImagePromptInput> {
  name = "mark-system-disk-image-prompt";
  description = "将指定名称的磁盘镜像标记为系统磁盘镜像";

  schema: PromptArgumentSchema<MarkSystemDiskImagePromptInput> = {
    imageName: {
      type: z.string(),
      description: "磁盘镜像名称",
      required: true,
    },
  };

  async generateMessages({ imageName }: MarkSystemDiskImagePromptInput) {
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
