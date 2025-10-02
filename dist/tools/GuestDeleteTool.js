import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
class GuestDeleteTool extends MCPTool {
    name = "guest-delete";
    description = "根据指定id删除云主机";
    schema = {
        guestID: {
            type: z.string(),
            description: "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            // 调用connector删除云主机
            const result = await connector.deleteGuest(input.guestID);
            if (result.error) {
                throw new Error(result.error);
            }
            return `云主机${input.guestID}删除成功`;
        }
        catch (error) {
            const output = `删除云主机失败: ${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GuestDeleteTool;
