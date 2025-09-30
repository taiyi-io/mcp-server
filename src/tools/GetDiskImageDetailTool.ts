import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { marshalFileRecord } from "../utils.js";
import { FileStatus } from "@taiyi-io/api-connector-ts";

interface GetDiskImageDetailInput {
  imageID: string;
}

class GetDiskImageDetailTool extends MCPTool<GetDiskImageDetailInput> {
  name = "get-disk-image-detail";
  description = "根据指定id获取磁盘镜像详情";

  schema = {
    imageID: {
      type: z.string(),
      description: "磁盘镜像的ID",
    },
  };

  async execute(input: GetDiskImageDetailInput) {
    try {
      const connector = await getConnector();
      const result = await connector.getDiskFile(input.imageID);
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("未找到磁盘镜像数据");
      }
      const image: FileStatus = result.data;
      const text = marshalFileRecord(image);
      return text;
    } catch (error) {
      const output = `获取磁盘镜像 ${input.imageID} 详情失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GetDiskImageDetailTool;
