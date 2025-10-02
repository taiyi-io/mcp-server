import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import {
  TaiyiConnector,
  ResourceAccessLevel,
} from "@taiyi-io/api-connector-ts";
import { marshalTaskData } from "../utils.js";

interface CreateDiskImageInput {
  guestID: string;
  imageName: string;
  imageDescription?: string;
  sync: boolean;
  access_level: ResourceAccessLevel;
}

class CreateDiskImageTool extends MCPTool<CreateDiskImageInput> {
  name = "create-disk-image";
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
    sync: {
      type: z.boolean(),
      description: "是否同步等待结果，默认否",
      default: false,
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

      // 异步处理情况
      if (!input.sync) {
        return `创建镜像任务启动，ID：${taskID}，可调用mcp-tool:check-task检查执行结果`;
      }

      // 同步等待结果，等待20分钟，间隔10秒
      const waitTimeout = 20 * 60;
      const waitInterval = 10;
      const taskResult = await connector.waitTask(
        taskID,
        waitTimeout,
        waitInterval
      );
      if (taskResult.error) {
        throw new Error(taskResult.error);
      } else if (!taskResult.data) {
        throw new Error("创建磁盘镜像失败：获取任务结果失败");
      }
      return marshalTaskData(taskResult.data);
    } catch (error) {
      const output = `创建磁盘镜像失败: ${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default CreateDiskImageTool;
