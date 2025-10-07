import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { getAllSystems, marshalSystemView } from "../utils.js";
class SearchSystemsTool extends MCPTool {
    name = "search-systems";
    description = "根据关键词搜索系统模板，返回匹配模板名称、操作系统类型、磁盘、网络、显卡、USB设备、启动方式、声卡等属性的系统模板信息";
    schema = {
        keywords: {
            type: z.array(z.string()).nonempty(),
            description: "关键词集合，不可为空，用于匹配系统模板的名称、操作系统、磁盘、网络等属性",
        },
        selfOnly: {
            type: z.boolean().optional(),
            description: "是否只搜索自己的系统模板，默认：否",
            default: false,
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const selfOnly = input.selfOnly || false;
            // 获取所有系统模板
            const systems = await getAllSystems(connector, selfOnly);
            // 根据关键词过滤匹配的系统模板
            const filteredSystems = systems.filter(system => {
                // 构建搜索文本，包含需要匹配的所有属性
                const searchText = `${system.label || ''} ${system.category || ''} ${system.disk || ''} ${system.network || ''} ${system.display || ''} ${system.usb || ''} ${system.firmware || ''} ${system.sound || ''}`.toLowerCase();
                // 检查是否包含任一关键词
                return input.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
            });
            if (filteredSystems.length === 0) {
                return `没有找到匹配关键词 "${input.keywords.join(', ')}" 的系统模板`;
            }
            // 格式化输出结果
            const formattedSystems = filteredSystems.map(system => marshalSystemView(system));
            return `找到 ${filteredSystems.length} 个匹配关键词 "${input.keywords.join(', ')}" 的系统模板：\n${formattedSystems.join('\n')}`;
        }
        catch (error) {
            return `搜索系统模板失败：${error instanceof Error ? error.message : String(error)}`;
        }
    }
}
export default SearchSystemsTool;
