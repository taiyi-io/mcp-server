import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { marshalGuestView, queryGuests } from "../utils.js";

interface SearchGuestsInput {
  keywords: string[];
  selfOnly?: boolean;
}

class SearchGuestsTool extends MCPTool<SearchGuestsInput> {
  name = "search-guests";
  description =
    "根据关键词搜索云主机，返回名称、存储池、地址池、主机ID、主机地址、所在池以及网络接口信息匹配任一关键词的云主机";

  schema = {
    keywords: {
      type: z.array(z.string()).nonempty(),
      description:
        "关键词集合，不可为空，用于匹配云主机的名称、存储池、地址池、主机ID、主机地址、所在池以及网络接口信息",
    },
    selfOnly: {
      type: z.boolean().optional(),
      description: "是否只搜索自己的云主机，默认：否",
      default: false,
    },
  };

  async execute(input: SearchGuestsInput) {
    try {
      if (input.keywords.length === 0) {
        return "必须指定关键词";
      }
      const connector = await getConnector();
      const selfOnly = input.selfOnly || false;

      // 获取所有云主机
      const guests = await queryGuests(connector, selfOnly);

      // 根据关键词过滤匹配的云主机
      const filteredGuests = guests.filter((guest) => {
        // 构建搜索文本，包含基本属性
        let searchText = `${guest.name || ""} ${guest.storage_pool || ""} ${
          guest.address_pool || ""
        } ${guest.host_id || ""} ${guest.host_address || ""} ${
          guest.pool || ""
        }`.toLowerCase();

        // 添加网络接口信息到搜索文本
        if (guest.network_interfaces) {
          // 处理内部网络接口
          if (guest.network_interfaces.internal) {
            guest.network_interfaces.internal.forEach((iface) => {
              searchText += ` ${iface.mac_address || ""} ${
                iface.ip_address || ""
              } ${iface.ip_address_v6 || ""}`;
            });
          }
          // 处理外部网络接口
          if (guest.network_interfaces.external) {
            guest.network_interfaces.external.forEach((iface) => {
              searchText += ` ${iface.mac_address || ""} ${
                iface.ip_address || ""
              } ${iface.ip_address_v6 || ""}`;
            });
          }
        }

        searchText = searchText.toLowerCase();
        // 检查是否包含任一关键词
        return input.keywords.some((keyword) =>
          searchText.includes(keyword.toLowerCase())
        );
      });

      if (filteredGuests.length === 0) {
        return `没有找到匹配关键词 "${input.keywords.join(", ")}" 的云主机`;
      }

      // 格式化输出结果
      const formattedGuests = filteredGuests.map((guest) =>
        marshalGuestView(guest)
      );

      return `找到 ${filteredGuests.length} 个匹配关键词 "${input.keywords.join(
        ", "
      )}" 的云主机：\n${formattedGuests.join("\n")}`;
    } catch (error) {
      return `搜索云主机失败：${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }
}

export default SearchGuestsTool;
