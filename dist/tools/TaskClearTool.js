import { MCPTool, logger } from "mcp-framework";
import { getConnector } from "../server.js";
class TaskClearTool extends MCPTool {
    name = "task-clear";
    description = "清除当前系统中的任务列表";
    schema = {
    // 无输入参数
    };
    async execute() {
        const connector = await getConnector();
        try {
            const result = await connector.clearTasks();
            if (result.error) {
                throw new Error(result.error);
            }
            return "任务列表已成功清除";
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`清除任务列表时发生错误: ${errorMessage}`);
            return `清除任务列表失败: ${errorMessage}`;
        }
    }
}
export default TaskClearTool;
