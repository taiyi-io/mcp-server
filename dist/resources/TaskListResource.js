import { MCPResource, logger } from "mcp-framework";
import { getConnector } from "../server.js";
import { getAllTasks, marshalTaskStatus } from "../utils.js";
/**
 * 任务列表资源
 * 返回当前用户可以访问的所有任务列表
 */
class TaskListResource extends MCPResource {
    uri = "resource://task/";
    name = "任务列表";
    description = "返回系统中的任务列表，包含任务ID、类型、状态、进度等信息";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        try {
            // 获取所有任务数据
            const allTasks = await getAllTasks(connector);
            // 处理任务数据
            const resources = [];
            allTasks.forEach((task) => {
                if (task.id !== undefined) {
                    const taskURI = `${this.uri}/${task.id}`;
                    const text = marshalTaskStatus(task);
                    resources.push({
                        uri: taskURI,
                        mimeType: this.mimeType,
                        text: text,
                    });
                }
                else {
                    logger.warn("发现没有ID的任务，跳过资源创建");
                }
            });
            return resources;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
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
}
export default TaskListResource;
