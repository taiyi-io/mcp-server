import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
class GuestHardShutdownTool extends MCPTool {
    name = "guest-hard-shutdown";
    description = "强制关闭云主机，强制关闭可能会导致云主机数据丢失，请谨慎操作。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";
    schema = {
        guestID: {
            type: z.string(),
            description: "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const { guestID } = input;
            // 执行强制关机操作: reboot=false, force=true
            const result = await connector.stopGuest(guestID, false, true);
            if (result.error) {
                throw new Error(result.error);
            }
            return `成功强制关闭云主机 ${guestID}`;
        }
        catch (error) {
            const output = `强制关闭云主机失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GuestHardShutdownTool;
