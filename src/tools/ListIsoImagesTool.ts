import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { getAllISOImages, marshalFileView } from "../utils.js";

interface ListIsoImagesInput {
  selfOnly?: boolean; // 是否只显示自己的ISO镜像
}

class ListIsoImagesTool extends MCPTool<ListIsoImagesInput> {
  name = "list-iso-images";
  description = "获取所有ISO镜像列表，包含id、名称、描述、创建修改时间、容量信息";

  schema = {
    selfOnly: {
      type: z.boolean().optional(),
      description: "是否只显示自己的ISO镜像，默认显示所有可访问的ISO镜像",
      default: false, 
    },
  };

  async execute(input: ListIsoImagesInput) {
    try {
      const connector = await getConnector();
      const selfOnly = input.selfOnly || false;
      
      const isoImages = await getAllISOImages(connector, selfOnly);
      const formattedImages = isoImages.map(image => marshalFileView(image));
      return `系统当前共有 ${isoImages.length} 个ISO镜像:\n ${formattedImages.join("\n")}`;
    } catch (error) {
      return `获取ISO镜像列表失败：${error instanceof Error ? error.message : String(error)}`
    }
  }
}

export default ListIsoImagesTool;