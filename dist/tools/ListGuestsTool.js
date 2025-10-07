import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { queryGuests, marshalGuestView } from "../utils.js";
class ListGuestsTool extends MCPTool {
    name = "list-guests";
    description = "获取所有云主机列表，包含主机名、标识、核心数、内存、磁盘配置和权限信息";
    schema = {
        selfOnly: {
            type: z.boolean().optional(),
            description: "是否只显示自己创建的云主机。默认：否，显示全部云主机",
            default: false
        },
        keywords: {
            type: z.array(z.string()).optional(),
            description: "显示云主机名称地址或者宿主机名称地址，匹配任一关键词的云主机。默认为空，显示全部云主机",
            default: []
        },
        pool: {
            type: z.string().optional(),
            description: "所属资源池，设置时，仅显示指定资源池管理的云主机。默认为空，显示全部云主机"
        },
        node: {
            type: z.string().optional(),
            description: "所属宿主机标识，设置时，仅显示制定宿主机管理的云主机。默认为空，显示全部云主机"
        },
        state: {
            type: z.string().optional(),
            description: "云主机状态：Running、Stopped、Starting、Stopping、Suspending、Suspended"
        }
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const guests = await queryGuests(connector, input.selfOnly || false, input.keywords || [], input.pool, input.node, input.state);
            const formattedGuests = guests.map(guest => marshalGuestView(guest));
            return `系统当前共有 ${guests.length} 个云主机:\n ${formattedGuests.join("\n")}`;
        }
        catch (error) {
            return `获取云主机列表失败：${error instanceof Error ? error.message : String(error)}`;
        }
    }
}
export default ListGuestsTool;
