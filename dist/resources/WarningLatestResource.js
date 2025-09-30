import { MCPResource, logger } from "mcp-framework";
import { getConnector } from "../server.js";
import { marshalConsoleEvent } from "../utils.js";
/**
 * 最新告警资源
 * 返回最新10条未读告警记录和总数统计
 */
class WarningLatestResource extends MCPResource {
    uri = "resource://warning/latest";
    name = "最新告警";
    description = "返回系统最新10条未读告警记录和各类告警总数统计";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        try {
            // 调用queryWarnings查询最新10条未读告警
            // 调整参数顺序以匹配正确的函数签名
            const result = await connector.queryWarnings(undefined, true, 0, 10);
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("获取告警列表失败：返回数据为空");
            }
            const warningSet = result.data;
            const resources = [];
            // 首先添加总数统计信息
            const criticalCount = warningSet.critical || 0;
            const alertCount = warningSet.alert || 0;
            const warningCount = warningSet.warning || 0;
            const totalCount = warningSet.total || 0;
            const summaryText = `当前 致命问题 ${criticalCount}个，报警 ${alertCount}个，警告 ${warningCount}个，共${totalCount}个`;
            resources.push({
                uri: "",
                mimeType: "text/plain",
                text: summaryText,
            });
            // 处理告警记录数据
            const records = warningSet.records || [];
            records.forEach((record) => {
                resources.push({
                    uri: this.uri,
                    mimeType: this.mimeType,
                    text: marshalConsoleEvent(record),
                });
            });
            return resources;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`读取最新告警资源时发生错误: ${errorMessage}`);
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
export default WarningLatestResource;
