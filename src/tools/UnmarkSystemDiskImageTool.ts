import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { ResourceType } from "@taiyi-io/api-connector-ts";

interface UnmarkSystemDiskImageInput {
  imageID: string;
}

class UnmarkSystemDiskImageTool extends MCPTool<UnmarkSystemDiskImageInput> {
  name = "unmark-system-disk-image";
  description =
    "根据指定id取消磁盘镜像的系统标记。可以通过mcp-tool:find-disk-image-id-by-name输入磁盘镜像名称获得磁盘镜像ID，再调用本接口";

  schema = {
    imageID: {
      type: z.string(),
      description:
        "磁盘镜像的ID。如果仅有磁盘镜像名称，可以通过mcp-tool:find-disk-image-id-by-name获取磁盘镜像ID",
    },
  };

  async execute(input: UnmarkSystemDiskImageInput) {
    try {
      const connector = await getConnector();
      await connector.setSystemResource(
        ResourceType.DiskImage,
        input.imageID,
        false
      );
      return `成功取消磁盘镜像 ${input.imageID} 的系统磁盘镜像标记`;
    } catch (error) {
      const output = `取消系统磁盘镜像标记失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default UnmarkSystemDiskImageTool;
