import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { GuestState } from "@taiyi-io/api-connector-ts";

interface EjectMediaInput {
  guestID: string;
}

class GuestEjectMediaTool extends MCPTool<EjectMediaInput> {
  name = "guest-eject-media";
  description =
    "卸载云主机的ISO媒体。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
    },
  };

  async execute(input: EjectMediaInput) {
    try {
      const connector = await getConnector();
      const { guestID } = input;

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
        throw new Error(
          `云主机 ${guestID} 不在运行状态，当前状态：${guest.state}`
        );
      }

      // 检查媒体是否已加载
      if (!guest.media_attached) {
        throw new Error(`云主机 ${guestID} 未加载媒体`);
      }

      // 执行卸载媒体操作
      const result = await connector.ejectMedia(guestID);

      if (result.error) {
        throw new Error(result.error);
      }

      return `成功卸载云主机 ${guestID} 的媒体`;
    } catch (error) {
      const output = `卸载媒体失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestEjectMediaTool;
