import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { getAllDiskImages, marshalFileView } from "../utils.js";

interface SearchDiskImagesInput {
  keywords: string[];
  selfOnly?: boolean;
}

class SearchDiskImagesTool extends MCPTool<SearchDiskImagesInput> {
  name = "search-disk-images";
  description = "根据关键词搜索磁盘镜像，返回名称、描述或者标签匹配任一关键词的磁盘镜像信息";

  schema = {
    keywords: {
      type: z.array(z.string()).nonempty(),
      description: "关键词集合，不可为空，用于匹配磁盘镜像的名称、描述或标签",
    },
    selfOnly: {
      type: z.boolean().optional(),
      description: "是否只搜索自己的磁盘镜像，默认：否",
      default: false,
    },
  };

  async execute(input: SearchDiskImagesInput) {
    try {
      const connector = await getConnector();
      const selfOnly = input.selfOnly || false;
      
      // 获取所有磁盘镜像
      const diskImages = await getAllDiskImages(connector, selfOnly);
      
      // 根据关键词过滤
      const filteredImages = diskImages.filter(image => {
        const searchText = `${image.name || ''} ${image.description || ''} ${image.tags?.join(' ') || ''}`.toLowerCase();
        return input.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
      });
      
      if (filteredImages.length === 0) {
        return `没有找到匹配关键词 "${input.keywords.join(', ')}" 的磁盘镜像`;
      }
      
      const formattedImages = filteredImages.map(image => marshalFileView(image));
      
      return `找到 ${filteredImages.length} 个匹配关键词 "${input.keywords.join(', ')}" 的磁盘镜像：\n${formattedImages.join('\n')}`;
    } catch (error) {
      return `搜索磁盘镜像失败：${error instanceof Error ? error.message : String(error)}`;
    }
  }
}

export default SearchDiskImagesTool;