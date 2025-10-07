import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { getAllDiskImages, marshalFileView } from "../utils.js";

interface ListDiskImagesInput {
  selfOnly?: boolean; // 是否只显示自己的磁盘镜像
}

class ListDiskImagesTool extends MCPTool<ListDiskImagesInput> {
  name = "list-disk-images";
  description = "获取所有磁盘镜像列表，包含id、名称、描述、创建修改时间、容量信息";

  schema = {
    selfOnly: {
      type: z.boolean().optional(),
      description: "是否只显示自己的磁盘镜像，默认显示所有可访问的磁盘镜像",
      default: false, 
    },
  };

  async execute(input: ListDiskImagesInput) {
    try {
      const connector = await getConnector();
      const selfOnly = input.selfOnly || false;
      
      const diskImages = await getAllDiskImages(connector, selfOnly);
      const formattedImages = diskImages.map(image => marshalFileView(image));
      
      return `系统当前共有 ${diskImages.length} 个磁盘镜像:\n ${formattedImages.join("\n")}`;
    } catch (error) {
      return `获取磁盘镜像列表失败：${error instanceof Error ? error.message : String(error)}`
    }
  }
}

export default ListDiskImagesTool;