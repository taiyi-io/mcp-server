import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { VolumeFormat } from "@taiyi-io/api-connector-ts";

interface GuestAddVolumeInput {
  guestID: string;
  sizeInGB: string;
}

class GuestAddVolumeTool extends MCPTool<GuestAddVolumeInput> {
  name = "guest-add-volume";
  description = "指定云主机ID，添加数据磁盘到云主机";

  schema = {
    guestID: {
      type: z.string(),
      description: "云主机的ID",
    },
    sizeInGB: {
      type: z.string().refine(
        (val) => {
          const num = parseInt(val);
          return !isNaN(num) && num >= 1;
        },
        { message: "磁盘容量必须是大于等于1的整数" }
      ),
      description: "要添加的数据磁盘容量，以GB为单位",
    },
  };

  async execute(input: GuestAddVolumeInput) {
    try {
      const connector = await getConnector();
      const { guestID, sizeInGB } = input;

      // 将字符串转换为数字
      const size = parseInt(sizeInGB);

      // 获取云主机当前磁盘清单
      const guestResult = await connector.getGuest(guestID);

      if (guestResult.error) {
        throw new Error(guestResult.error);
      }

      // 检查tag，找到尚未使用的data_{index}
      let index = 1;
      const existingTags =
        guestResult.data?.disks?.map((disk) => disk.tag) || [];

      while (existingTags.includes(`data${index}`)) {
        index++;
      }

      const tag = `data${index}`;
      const sizeInMB = size * 1024;

      // 生成VolumeSpec
      const volumeSpec = {
        tag,
        size: sizeInMB,
        format: VolumeFormat.Qcow,
      };

      // 调用connector.addVolume进行创建
      const addResult = await connector.addVolume(guestID, volumeSpec);

      if (addResult.error) {
        throw new Error(addResult.error);
      }

      return `成功添加数据磁盘 ${tag} (${size}GB) 到云主机 ${guestID}`;
    } catch (error) {
      const output = `添加数据磁盘失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestAddVolumeTool;
