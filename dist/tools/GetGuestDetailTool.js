import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { marshalGuestView } from "../utils.js";
class GetGuestDetailTool extends MCPTool {
    name = "get-guest-detail";
    description = "根据指定ID获取云主机详情，包含标识、主机名、核心数、内存、磁盘配置、运行状态、网络速度、磁盘io带宽、所属宿主机资源池和权限信息，通常用于查看和判断云主机";
    schema = {
        guestID: {
            type: z.string(),
            description: "云主机的ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const result = await connector.getGuest(input.guestID);
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("未找到云主机数据");
            }
            const guest = result.data;
            const text = marshalGuestView(guest);
            return text;
        }
        catch (error) {
            const output = `获取云主机 ${input.guestID} 详情失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GetGuestDetailTool;
