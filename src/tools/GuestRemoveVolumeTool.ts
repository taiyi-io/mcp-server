import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface GuestRemoveVolumeInput {
  guestID: string;
  tag: string;
}

class GuestRemoveVolumeTool extends MCPTool<GuestRemoveVolumeInput> {
  name = "guest-remove-volume";
  description =
    "指定云主机ID和磁盘标签，删除数据磁盘。不支持删除系统磁盘。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
    },
    tag: {
      type: z.string().regex(/^data_\d+$/),
      description:
        "要删除的目标磁盘标签，从云主机详情或者云主机列表中获取，只能删除data_开头的数据磁盘",
    },
  };

  async execute(input: GuestRemoveVolumeInput) {
    try {
      const connector = await getConnector();
      const { guestID, tag } = input;

      // 验证标签不是系统磁盘
      if (tag.startsWith("sys_")) {
        throw new Error("不允许删除系统磁盘");
      }

      // 调用connector.deleteVolume删除磁盘
      const result = await connector.deleteVolume(guestID, tag);

      if (result.error) {
        throw new Error(result.error);
      }

      return `成功删除云主机 ${guestID} 上的数据磁盘 ${tag}`;
    } catch (error) {
      const output = `删除数据磁盘失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestRemoveVolumeTool;
