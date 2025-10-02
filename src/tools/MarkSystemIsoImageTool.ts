import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { ResourceType } from "@taiyi-io/api-connector-ts";

interface MarkSystemIsoImageInput {
  imageID: string;
}

class MarkSystemIsoImageTool extends MCPTool<MarkSystemIsoImageInput> {
  name = "mark-system-iso-image";
  description =
    "根据指定id将ISO镜像标记为系统ISO镜像。可以通过mcp-tool:find-iso-image-id-by-name输入ISO镜像名称获得ISO镜像ID，再调用本接口";

  schema = {
    imageID: {
      type: z.string(),
      description:
        "ISO镜像的ID。如果仅有ISO镜像名称，可以通过mcp-tool:find-iso-image-id-by-name获取ISO镜像ID",
    },
  };

  async execute(input: MarkSystemIsoImageInput) {
    try {
      const connector = await getConnector();
      await connector.setSystemResource(
        ResourceType.ISOImage,
        input.imageID,
        true
      );
      return `成功将ISO镜像 ${input.imageID} 标记为系统ISO镜像`;
    } catch (error) {
      const output = `标记系统ISO镜像失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default MarkSystemIsoImageTool;
