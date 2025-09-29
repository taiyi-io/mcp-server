import { MCPPrompt } from "mcp-framework";
import { z } from "zod";

interface MarkSystemIsoImageInput {
  imageName: string;
}

class MarkSystemIsoImagePrompt extends MCPPrompt<MarkSystemIsoImageInput> {
  name = "mark-system-iso-image";
  description = "将指定名称的ISO镜像标记为系统ISO镜像";

  schema = {
    imageName: {
      type: z.string(),
      description: "ISO镜像名称",
      required: true,
    },
  };

  async generateMessages({ imageName }: MarkSystemIsoImageInput) {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `从resource://iso-image/iso镜像列表获取名称为 ${imageName} 的ISO镜像ID，然后调用mcp:mark-system-iso-image标记为系统镜像`,
        },
      },
    ];
  }
}

export default MarkSystemIsoImagePrompt;
