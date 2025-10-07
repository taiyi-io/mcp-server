import { MCPTool } from "mcp-framework";
import { getConnector } from "../server.js";
import { getAllTasks, marshalTaskStatus } from "../utils.js";
class ListTasksTool extends MCPTool {
    name = "list-tasks";
    description = "获取所有任务列表，包含任务ID、类型、状态、进度等信息";
    schema = {};
    async execute() {
        try {
            const connector = await getConnector();
            const tasks = await getAllTasks(connector);
            const formattedTasks = tasks.map(task => marshalTaskStatus(task));
            return `系统当前共有 ${tasks.length} 个任务:\n ${formattedTasks.join("\n")}`;
        }
        catch (error) {
            return `获取任务列表失败：${error instanceof Error ? error.message : String(error)}`;
        }
    }
}
export default ListTasksTool;
