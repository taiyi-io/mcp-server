import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { queryGuests, marshalGuestView } from "../utils.js";
import { GuestState } from "@taiyi-io/api-connector-ts";

interface ListGuestsInput {
  selfOnly?: boolean; // 是否只显示自己创建的云主机
  keywords?: string[]; // 搜索关键词列表
  pool?: string; // 所属资源池
  node?: string; // 所属宿主机标识
  state?: GuestState; // 云主机状态
}

class ListGuestsTool extends MCPTool<ListGuestsInput> {
  name = "list-guests";
  description =
    "获取所有云主机列表，包含主机名、标识、核心数、内存、磁盘配置和权限信息";

  schema = {
    selfOnly: {
      type: z.boolean().optional(),
      description: "是否只显示自己创建的云主机。默认：否，显示全部云主机",
      default: false,
    },
    keywords: {
      type: z.array(z.string()).optional(),
      description:
        "显示云主机名称地址或者宿主机名称地址，匹配任一关键词的云主机。默认为空，显示全部云主机",
      default: [],
    },
    pool: {
      type: z.string().optional(),
      description:
        "所属资源池，设置时，仅显示指定资源池管理的云主机。默认为空，显示全部云主机",
    },
    node: {
      type: z.string().optional(),
      description:
        "所属宿主机标识，设置时，仅显示制定宿主机管理的云主机。默认为空，显示全部云主机",
    },
    state: {
      type: z.string().optional(),
      description:
        "云主机状态：stopped、starting、running、stopping、suspending、suspended",
    },
  };

  async execute(input: ListGuestsInput) {
    try {
      const connector = await getConnector();
      let targetState: GuestState | undefined = undefined;
      if (input.state) {
        targetState = input.state as GuestState;
      }
      const guests = await queryGuests(
        connector,
        input.selfOnly || false,
        input.keywords || [],
        input.pool,
        input.node,
        targetState
      );

      const formattedGuests = guests.map((guest) => marshalGuestView(guest));

      return `系统当前共有 ${
        guests.length
      } 个符合条件的云主机:\n ${formattedGuests.join("\n")}`;
    } catch (error) {
      return `获取云主机列表失败：${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }
}

export default ListGuestsTool;
