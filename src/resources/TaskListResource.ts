import { MCPResource, ResourceContent, logger } from "mcp-framework";
import {
  TaiyiConnector,
  TaskData,
  PaginationResult,
  BackendResult
} from "@taiyi-io/api-connector-ts";
import { getConnector } from "../server.js";
import { marshalTaskStatus } from "../utils.js";

/**
 * 任务列表资源
 * 返回当前用户可以访问的所有任务列表
 */
class TaskListResource extends MCPResource {
  uri = "resource://task/";
  name = "任务列表";
  description = "返回系统中的任务列表，包含任务ID、类型、状态、进度等信息";
  mimeType = "application/json";

  async read(): Promise<ResourceContent[]> {
    const connector: TaiyiConnector = await getConnector();
    try {
      // 获取所有任务数据
      const allTasks = await this.getAllTasks(connector);

      // 处理任务数据
      const resources: ResourceContent[] = [];
      allTasks.forEach((task) => {
        if (task.id !== undefined) {
          const taskURI = `${this.uri}/${task.id}`;
          const text = marshalTaskStatus(task);
          resources.push({
            uri: taskURI,
            mimeType: this.mimeType,
            text: text,
          });
        } else {
          logger.warn("发现没有ID的任务，跳过资源创建");
        }
      });

      return resources;
    } catch (error) {
      const errorMessage = 
        error instanceof Error ? error.message : String(error);
      logger.error(`读取任务列表资源时发生错误: ${errorMessage}`);
      return [
        {
          uri: "",
          mimeType: "text/plain",
          text: errorMessage,
        },
      ];
    }
  }

  /**
   * 分页获取所有任务列表
   * 参考getAllDiskImages实现
   */
  private async getAllTasks(connector: TaiyiConnector): Promise<TaskData[]> {
    let allTasks: TaskData[] = [];
    let offset = 0;
    const pageSize = 20;
    let total = 0;

    // 第一次请求获取总数
    const firstResponse: BackendResult<PaginationResult<TaskData>> = 
      await connector.queryTasks(offset, pageSize);
    if (firstResponse.error) {
      throw new Error(firstResponse.error);
    } else if (!firstResponse?.data) {
      throw new Error("获取任务列表失败：返回数据为空");
    }
    total = firstResponse?.data?.total || 0;
    allTasks = firstResponse?.data?.records 
      ? [...firstResponse.data.records] 
      : [];

    // 根据总数计算需要请求的偏移量
    const requests: Promise<BackendResult<PaginationResult<TaskData>>>[] = [];
    offset += pageSize;

    // 从下一个偏移量开始请求剩余数据
    while (offset < total) {
      requests.push(connector.queryTasks(offset, pageSize));
      offset += pageSize;
    }

    // 并行请求所有剩余页面
    if (requests.length > 0) {
      const responses = await Promise.all(requests);
      for (const response of responses) {
        // 校验返回结果
        if (response.error) {
          throw new Error(response.error);
        } else if (!response?.data) {
          throw new Error("获取任务列表失败：返回数据为空");
        }
        if (response?.data?.records) {
          allTasks = [...allTasks, ...response.data.records];
        }
      }
    }
    
    return allTasks;
  }
}

export default TaskListResource;
