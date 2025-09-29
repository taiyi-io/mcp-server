import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface DeleteDiskImageInput {
  imageID: string;
}

class DeleteDiskImageTool extends MCPTool<DeleteDiskImageInput> {
  name = "delete-disk-image";
  description = "根据指定id删除磁盘镜像";

  schema = {
    imageID: {
      type: z.string(),
      description: "磁盘镜像的ID",
    },
  };

  async execute(input: DeleteDiskImageInput) {
    try {
      const connector = await getConnector();
      await connector.deleteDiskFile(input.imageID);
      return `成功删除磁盘镜像 ${input.imageID}`;
    } catch (error) {
      const output = `删除磁盘镜像失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default DeleteDiskImageTool;
