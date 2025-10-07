import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { getAllISOImages, marshalFileView } from "../utils.js";
class SearchIsoImagesTool extends MCPTool {
    name = "search-iso-images";
    description = "根据关键词搜索 ISO 镜像，返回名称、描述或者标签匹配任一关键词的 ISO 镜像信息";
    schema = {
        keywords: {
            type: z.array(z.string()).nonempty(),
            description: "关键词集合，不可为空，用于匹配 ISO 镜像的名称、描述或标签",
        },
        selfOnly: {
            type: z.boolean().optional(),
            description: "是否只搜索自己的 ISO 镜像，默认：否",
            default: false,
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const selfOnly = input.selfOnly || false;
            // 获取所有 ISO 镜像
            const isoImages = await getAllISOImages(connector, selfOnly);
            // 根据关键词过滤匹配的 ISO 镜像
            const filteredImages = isoImages.filter(image => {
                // 构建搜索文本，包含名称、描述和标签
                const searchText = `${image.name || ''} ${image.description || ''} ${image.tags?.join(' ') || ''}`.toLowerCase();
                // 检查是否包含任一关键词
                return input.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
            });
            if (filteredImages.length === 0) {
                return `没有找到匹配关键词 "${input.keywords.join(', ')}" 的 ISO 镜像`;
            }
            // 格式化输出结果
            const formattedImages = filteredImages.map(image => marshalFileView(image));
            return `找到 ${filteredImages.length} 个匹配关键词 "${input.keywords.join(', ')}" 的 ISO 镜像：\n${formattedImages.join('\n')}`;
        }
        catch (error) {
            return `搜索 ISO 镜像失败：${error instanceof Error ? error.message : String(error)}`;
        }
    }
}
export default SearchIsoImagesTool;
