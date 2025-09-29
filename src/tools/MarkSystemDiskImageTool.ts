import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { ResourceType } from "@taiyi-io/api-connector-ts";

interface MarkSystemDiskImageInput {
  imageID: string;
}

class MarkSystemDiskImageTool extends MCPTool<MarkSystemDiskImageInput> {
  name = "mark-system-disk-image";
  description = "将指定的磁盘镜像标记为系统磁盘镜像";

  schema = {
    imageID: {
      type: z.string(),
      description: "磁盘镜像的ID",
    },
  };

  async execute(input: MarkSystemDiskImageInput) {
    try {
      const connector = await getConnector();
      await connector.setSystemResource(
        ResourceType.DiskImage,
        input.imageID,
        true
      );
      return `成功将磁盘镜像 ${input.imageID} 标记为系统磁盘镜像`;
    } catch (error) {
      const output = `标记系统磁盘镜像失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default MarkSystemDiskImageTool;
