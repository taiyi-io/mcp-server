import { MCPPrompt } from "mcp-framework";
import { z } from "zod";

interface ChangeIsoImageNameInput {
  currentName: string;
  newName: string;
}

class ChangeIsoImageNamePrompt extends MCPPrompt<ChangeIsoImageNameInput> {
  name = "change-iso-image-name";
  description = "修改ISO镜像的名称";

  schema = {
    currentName: {
      type: z.string(),
      description: "ISO镜像的当前名称",
      required: true,
    },
    newName: {
      type: z.string().nonempty(),
      description: "ISO镜像的新名称（必填非空）",
      required: true,
    },
  };

  async generateMessages({ currentName, newName }: ChangeIsoImageNameInput) {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `从resource://iso-image/iso镜像列表获取名称为 ${currentName} 的ISO镜像ID，然后调用mcp:modify-iso-image修改该ISO镜像的名称为 ${newName}`,
        },
      },
    ];
  }
}

export default ChangeIsoImageNamePrompt;
