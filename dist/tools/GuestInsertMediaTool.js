import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { GuestState } from "@taiyi-io/api-connector-ts";
class GuestInsertMediaTool extends MCPTool {
    name = "guest-insert-media";
    description = "为云主机加载ISO媒体。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id；如果仅知道ISO镜像名称，可以通过mcp-tool:find-iso-image-id-by-name获取ISO镜像id，再调用本方法";
    schema = {
        guestID: {
            type: z.string(),
            description: "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
        },
        mediaID: {
            type: z.string(),
            description: "ISO镜像的ID。如果仅有ISO镜像名称，可以通过mcp-tool:find-iso-image-id-by-name获取ISO镜像ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const { guestID, mediaID } = input;
            // 获取云主机信息
            const guestResult = await connector.getGuest(guestID);
            if (guestResult.error) {
                throw new Error(guestResult.error);
            }
            if (!guestResult.data) {
                throw new Error(`未找到云主机 ${guestID}`);
            }
            const guest = guestResult.data;
            // 检查云主机状态是否为运行中
            if (guest.state !== GuestState.Running) {
                throw new Error(`云主机 ${guestID} 不在运行状态，当前状态：${guest.state}`);
            }
            // 检查媒体是否已加载
            if (guest.media_attached) {
                throw new Error(`云主机 ${guestID} 已加载媒体，请先卸载`);
            }
            // 执行加载媒体操作
            const result = await connector.insertMedia(guestID, mediaID);
            if (result.error) {
                throw new Error(result.error);
            }
            return `成功为云主机 ${guestID} 加载媒体 ${mediaID}`;
        }
        catch (error) {
            const output = `加载媒体失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GuestInsertMediaTool;
