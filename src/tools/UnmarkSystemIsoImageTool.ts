import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { ResourceType } from "@taiyi-io/api-connector-ts";

interface UnmarkSystemIsoImageInput {
  imageID: string;
}

class UnmarkSystemIsoImageTool extends MCPTool<UnmarkSystemIsoImageInput> {
  name = "unmark-system-iso-image";
  description =
    "根据指定id取消ISO镜像的系统标记。可以通过mcp-tool:find-iso-image-id-by-name输入ISO镜像名称获得ISO镜像ID，再调用本接口";

  schema = {
    imageID: {
      type: z.string(),
      description:
        "ISO镜像的ID。如果仅有ISO镜像名称，可以通过mcp-tool:find-iso-image-id-by-name获取ISO镜像ID",
    },
  };

  async execute(input: UnmarkSystemIsoImageInput) {
    try {
      const connector = await getConnector();
      await connector.setSystemResource(
        ResourceType.ISOImage,
        input.imageID,
        false
      );
      return `成功取消ISO镜像 ${input.imageID} 的系统ISO镜像标记`;
    } catch (error) {
      const output = `取消系统ISO镜像标记失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default UnmarkSystemIsoImageTool;
