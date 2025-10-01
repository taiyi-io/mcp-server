import { MCPResource, logger } from "mcp-framework";
import { getConnector } from "../server.js";
import { marshalDiskSpeed, marshalNetworkSpeed } from "../utils.js";
/**
 * 将PoolResourceSnapshot对象转换为JSON字符串
 */
function marshalPoolUsage(snapshot) {
    const obj = {};
    // 资源池基本信息
    obj["标识"] = snapshot.pool_id;
    // 节点信息
    obj["节点"] = `在线 ${snapshot.node_online} /离线 ${snapshot.node_offline} /丢失 ${snapshot.node_lost}`;
    // 云主机信息
    obj["云主机"] = `运行 ${snapshot.guest_running} /停止 ${snapshot.guest_stopped} /未知 ${snapshot.guest_unkown}`;
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
    obj["磁盘速度"] = marshalDiskSpeed(snapshot.read_bytes_per_second, snapshot.write_bytes_per_second);
    obj["网络带宽"] = marshalNetworkSpeed(snapshot.received_bytes_per_second, snapshot.transmitted_bytes_per_second);
    // 时间戳
    if (snapshot.timestamp) {
        obj["更新时间"] = new Date(snapshot.timestamp).toLocaleString();
    }
    return JSON.stringify(obj);
}
/**
 * 资源池使用情况资源
 * 返回当前所有计算资源池的使用情况和状态信息
 */
class PoolsUsageResource extends MCPResource {
    uri = "resource://pools-usage";
    name = "资源池资源用量";
    description = "返回当前所有计算资源池的使用情况和状态信息，包含节点状态、云主机状态、核心利用率、内存利用率、磁盘利用率、网络情况和系统状态。";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        try {
            // 先调用queryComputePools获取计算资源池id列表
            const computePoolsResult = await connector.queryComputePools();
            if (computePoolsResult.error) {
                throw new Error(computePoolsResult.error);
            }
            else if (!computePoolsResult.data) {
                throw new Error("获取计算资源池列表失败：返回数据为空");
            }
            const computePools = computePoolsResult.data;
            const poolIds = computePools.map((pool) => pool.id);
            // 调用queryPoolsUsage获取PoolResourceSnapshot
            const poolsUsageResult = await connector.queryPoolsUsage(poolIds);
            if (poolsUsageResult.error) {
                throw new Error(poolsUsageResult.error);
            }
            else if (!poolsUsageResult.data) {
                throw new Error("获取资源池使用情况失败：返回数据为空");
            }
            const poolsUsage = poolsUsageResult.data;
            // 构建返回多个resource对象
            const resourcesList = poolsUsage.map((poolUsage) => {
                const poolUri = `${this.uri}/${poolUsage.pool_id}`;
                const text = marshalPoolUsage(poolUsage);
                return {
                    uri: poolUri,
                    mimeType: "application/json",
                    text: text,
                };
            });
            return resourcesList;
        }
        catch (error) {
            const output = `获取资源池使用情况失败：${error instanceof Error ? error.message : String(error)}`;
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
export default PoolsUsageResource;
