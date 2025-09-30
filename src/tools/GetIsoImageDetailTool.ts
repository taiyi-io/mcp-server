import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { marshalFileRecord } from "../utils.js";
import { FileStatus } from "@taiyi-io/api-connector-ts";

interface GetIsoImageDetailInput {
  imageID: string;
}

class GetIsoImageDetailTool extends MCPTool<GetIsoImageDetailInput> {
  name = "get-iso-image-detail";
  description = "根据指定id获取ISO镜像详情";

  schema = {
    imageID: {
      type: z.string(),
      description: "ISO镜像的ID",
    },
  };

  async execute(input: GetIsoImageDetailInput) {
    try {
      const connector = await getConnector();
      const result = await connector.getISOFile(input.imageID);
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("未找到ISO镜像数据");
      }
      const image: FileStatus = result.data;
      const text = marshalFileRecord(image);
      return text;
    } catch (error) {
      const output = `获取ISO镜像 ${input.imageID} 详情失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GetIsoImageDetailTool;
