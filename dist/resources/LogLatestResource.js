import { MCPResource, logger } from "mcp-framework";
import { getConnector } from "../server.js";
import { marshalConsoleEvent } from "../utils.js";
/**
 * 最新日志资源
 * 返回最新10条日志记录
 */
class LogLatestResource extends MCPResource {
    uri = "resource://log/latest";
    name = "最新日志";
    description = "返回系统最新10条日志记录，包含级别、范围、内容和时间信息";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        try {
            // 获取今天的日期，格式为YYYY-MM-DD
            const today = new Date();
            const dateStr = today.toISOString().split("T")[0];
            // 调用queryLogs查询最新10条日志
            const result = await connector.queryLogs(dateStr, 0, 10);
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("获取日志列表失败：返回数据为空");
            }
            const logs = result.data.records || [];
            const resources = [];
            // 处理日志数据
            logs.forEach((log) => {
                resources.push({
                    uri: this.uri,
                    mimeType: this.mimeType,
                    text: marshalConsoleEvent(log),
                });
            });
            return resources;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`读取最新日志资源时发生错误: ${errorMessage}`);
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
export default LogLatestResource;
