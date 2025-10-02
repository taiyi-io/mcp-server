import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface ModifyIsoImageInput {
  imageID: string;
  name: string;
  description?: string;
  tags?: string[];
}

class ModifyIsoImageTool extends MCPTool<ModifyIsoImageInput> {
  name = "modify-iso-image";
  description =
    "根据指定id修改ISO镜像的名称、描述和标签信息。可以通过mcp-tool:find-iso-image-id-by-name输入ISO镜像名称获得ISO镜像ID，再调用本接口";

  schema = {
    imageID: {
      type: z.string(),
      description:
        "ISO镜像的ID。如果仅有ISO镜像名称，可以通过mcp-tool:find-iso-image-id-by-name获取ISO镜像ID",
    },
    name: {
      type: z.string().nonempty(),
      description: "ISO镜像的名称（必填非空）",
    },
    description: {
      type: z.string().optional(),
      description: "ISO镜像的描述",
    },
    tags: {
      type: z.array(z.string()).optional(),
      description: "ISO镜像的标签列表",
    },
  };

  async execute(input: ModifyIsoImageInput) {
    try {
      const connector = await getConnector();
      const fileSpec = {
        name: input.name,
        description: input.description,
        tags: input.tags,
      };
      await connector.modifyISOFile(input.imageID, fileSpec);
      return `成功修改ISO镜像 ${input.imageID} 的信息`;
    } catch (error) {
      const output = `修改ISO镜像信息失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default ModifyIsoImageTool;
