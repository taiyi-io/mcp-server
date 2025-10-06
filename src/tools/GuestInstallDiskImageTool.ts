import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { TaiyiConnector } from "@taiyi-io/api-connector-ts";

interface InstallDiskImageInput {
  guestID: string;
  diskImageID: string;
}

class GuestInstallDiskImageTool extends MCPTool<InstallDiskImageInput> {
  name = "guest-install-disk-image";
  description = "把磁盘镜像安装到目标云主机，支持同步等待结果";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
    },
    diskImageID: {
      type: z.string(),
      description:
        "磁盘镜像ID，如果仅有名称，可以通过mcp-tool:find-disk-image-id-by-name获取ID",
    },
  };

  async execute(input: InstallDiskImageInput) {
    try {
      const connector: TaiyiConnector = await getConnector();

      // 调用connector安装磁盘镜像
      const result = await connector.tryInstallDiskImage(
        input.guestID,
        "sys",
        input.diskImageID
      );

      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("安装磁盘镜像失败：获取任务ID失败");
      }

      const taskID = result.data;
      return `新任务${taskID}已启动，安装镜像到云主机${input.guestID}。可调用mcp-tool:check-task检查执行结果`;
    } catch (error) {
      const output = `安装磁盘镜像失败: ${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestInstallDiskImageTool;
