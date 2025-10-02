import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
class GuestModifyAutostartTool extends MCPTool {
    name = "guest-modify-autostart";
    description = "指定云主机ID，启用或禁用云主机的自动启动功能。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";
    schema = {
        guestID: {
            type: z.string(),
            description: "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
        },
        enable: {
            type: z.boolean().optional(),
            description: "是否启用自动启动，默认为true",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const enable = input.enable !== false; // 默认为true
            const result = await connector.modifyAutoStart(input.guestID, enable);
            if (result.error) {
                throw new Error(result.error);
            }
            return `成功${enable ? "启用" : "禁用"}云主机 ${input.guestID} 的自动启动功能`;
        }
        catch (error) {
            const output = `修改云主机自动启动功能失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GuestModifyAutostartTool;
