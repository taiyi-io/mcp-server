import { MCPResource, logger } from "mcp-framework";
import { getConnector } from "../server.js";
function formatRuntime(startedTime) {
    try {
        const startTime = new Date(startedTime);
        const currentTime = new Date();
        const diffMs = currentTime.getTime() - startTime.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays > 0) {
            return `已运行${diffDays}天`;
        }
        else if (diffHours > 0) {
            return `已运行${diffHours}小时`;
        }
        else {
            return `已运行${diffMinutes}分钟`;
        }
    }
    catch (error) {
        logger.error(`格式化运行时间失败: ${error instanceof Error ? error.message : String(error)}`);
        return "未知";
    }
}
/**
 * 将ClusterResourceSnapshot对象转换为JSON字符串
 */
function marshalClusterUsage(snapshot) {
    const obj = {};
    // 节点信息
    obj["节点"] = `在线 ${snapshot.node_online} /离线 ${snapshot.node_offline} /丢失 ${snapshot.node_lost}`;
    // 资源池信息
    obj["资源池"] = `启用 ${snapshot.pool_enabled} /禁用 ${snapshot.pool_disabled}`;
    // 运行时间
    if (snapshot.started_time) {
        obj["运行时间"] = formatRuntime(snapshot.started_time);
    }
    // 云主机信息
    obj["云主机"] = `运行 ${snapshot.guest_running} /停止 ${snapshot.guest_stopped}`;
    // 核心利用率
    if (snapshot.core_usage !== undefined && snapshot.cores !== undefined) {
        const usedCores = parseFloat(((snapshot.core_usage * snapshot.cores) / 100).toFixed(2));
        obj["核心利用率"] = `${usedCores} / ${snapshot.cores}`;
    }
    // 内存利用率
    if (snapshot.memory_used !== undefined && snapshot.memory !== undefined) {
        obj["内存利用率"] = `${snapshot.memory_used} / ${snapshot.memory} MB 已用`;
    }
    // 磁盘利用率
    if (snapshot.disk_used !== undefined && snapshot.disk !== undefined) {
        const diskUsedGB = parseFloat((snapshot.disk_used / 1024).toFixed(2));
        const diskTotalGB = Math.floor(snapshot.disk / 1024);
        obj["磁盘利用率"] = `${diskUsedGB} / ${diskTotalGB} GB`;
    }
    // 状态信息
    obj["状态"] = `致命故障 ${snapshot.critical}, 报警 ${snapshot.alert}, 警告 ${snapshot.warning}`;
    return JSON.stringify(obj);
}
/**
 * 集群使用情况资源
 * 返回当前集群的整体使用情况和状态信息
 */
class ClusterUsageResource extends MCPResource {
    uri = "resource://cluster-usage";
    name = "集群使用情况";
    description = "返回当前集群的整体使用情况和状态信息，包含节点状态、资源池状态、运行时间、云主机状态、核心利用率、内存利用率、磁盘利用率和系统状态。";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        try {
            // 调用queryClusterUsage获取集群使用情况
            const result = await connector.queryClusterUsage();
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("获取集群使用情况失败：返回数据为空");
            }
            const snapshot = result.data;
            const text = marshalClusterUsage(snapshot);
            return [
                {
                    uri: this.uri,
                    mimeType: this.mimeType,
                    text: text,
                },
            ];
        }
        catch (error) {
            const output = `获取集群使用情况失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return [
                {
                    uri: "",
                    mimeType: "text/plain",
                    text: output,
                },
            ];
        }
    }
}
export default ClusterUsageResource;
