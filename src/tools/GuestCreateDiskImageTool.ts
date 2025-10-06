import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import {
  TaiyiConnector,
  ResourceAccessLevel,
} from "@taiyi-io/api-connector-ts";

interface CreateDiskImageInput {
  guestID: string;
  imageName: string;
  imageDescription?: string;
  access_level: ResourceAccessLevel;
}

class GuestCreateDiskImageTool extends MCPTool<CreateDiskImageInput> {
  name = "guest-create-disk-image";
  description = "使用云主机的系统盘创建磁盘镜像，支持同步等待结果";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
    },
    imageName: {
      type: z.string(),
      description: "镜像名",
    },
    access_level: {
      type: z.nativeEnum(ResourceAccessLevel),
      description:
        "资源访问级别:private:私有<默认>, share_view:共享查看, share_edit:共享编辑, global_view:全局可见",
      default: ResourceAccessLevel.Private,
    },
    imageDescription: {
      type: z.string().optional(),
      description: "描述",
    },
  };

  async execute(input: CreateDiskImageInput) {
    try {
      const connector: TaiyiConnector = await getConnector();

      // 构建FileSpec
      const spec = {
        name: input.imageName,
        description: input.imageDescription || "",
        access_level: input.access_level,
      };

      // 调用connector创建磁盘镜像
      const result = await connector.tryCreateDiskImage(
        input.guestID,
        "sys",
        spec,
        input.access_level
      );

      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("创建磁盘镜像失败：获取任务ID失败");
      }

      const taskID = result.data;

      return `新任务${taskID}已启动，创建镜像${input.imageName}。可调用mcp-tool:check-task检查执行结果`;
    } catch (error) {
      const output = `创建磁盘镜像失败: ${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestCreateDiskImageTool;
