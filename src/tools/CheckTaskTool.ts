import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { TaiyiConnector, TaskData } from "@taiyi-io/api-connector-ts";
import { marshalTaskStatus } from "../utils.js";

interface CheckTaskInput {
  taskID: string;
}

class CheckTaskTool extends MCPTool<CheckTaskInput> {
  name = "check-task";
  description =
    "检查任务执行进度，获取失败或者成功的执行结果；如果任务还在处理中，可以等待一段时间后重试，比如间隔10-30秒重试";

  schema = {
    taskID: {
      type: z.string(),
      description: "成功创建异步任务时，返回的任务id",
    },
  };

  async execute(input: CheckTaskInput) {
    try {
      const connector: TaiyiConnector = await getConnector();
      // 调用connector.getTask获取任务数据
      const result = await connector.getTask(input.taskID);

      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("未找到任务数据");
      }

      const task: TaskData = result.data;
      // 获取任务类型的中文描述
      return marshalTaskStatus(task);
    } catch (error) {
      const output = `检查任务 ${input.taskID} 失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default CheckTaskTool;
