import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { StatisticRange, } from "@taiyi-io/api-connector-ts";
import { marshalDiskSpeed, marshalNetworkSpeed } from "../utils.js";
function marshalStatisticData(usage, // 使用ResourceStatisticUnit类型
spec) {
    const obj = {};
    const totalDisk = spec.disks.reduce((acc, disk) => acc + (disk.size || 0), 0);
    // CPU平均负载
    if (usage && usage.cores && usage.cores.average !== undefined) {
        obj["平均CPU负载"] = `${((usage.cores.average * spec.cores) / 100).toFixed(2)} / ${spec.cores} 核心`;
    }
    // 内存平均使用
    if (usage && usage.memory && usage.memory.average !== undefined) {
        obj["平均内存使用"] = `${((usage.memory.average * spec.memory) /
            100).toFixed(2)} / ${spec.memory} MB`;
    }
    // 磁盘平均使用
    if (usage && usage.disk && usage.disk.average !== undefined) {
        obj["平均磁盘使用"] = `${((usage.disk.average * totalDisk) /
            100 /
            1024).toFixed(2)} / ${(totalDisk / 1024).toFixed(2)} GB`;
    }
    obj["平均磁盘速度"] = marshalDiskSpeed(usage.readBytesPerSecond.average, usage.writeBytesPerSecond.average);
    obj["平均网络带宽"] = marshalNetworkSpeed(usage.receivedBytesPerSecond.average, usage.transmittedBytesPerSecond.average);
    obj["采集时间"] = new Date(usage.timestamp).toLocaleString();
    return obj;
}
class GetGuestStatisticUsageTool extends MCPTool {
    name = "get-guest-statistic-usage";
    description = "获取云主机的统计资源使用情况，CPU、内存、磁盘负载和磁盘读写速度，网络收发带宽等信息，通常用于分析云主机的历史性能表现和资源用量。统计范围可以选择最近1小时、最近24小时、最近7天、最近30天，返回数据包含多个时间点数据序列，每个时间点包含对应时刻的指标平均值";
    schema = {
        guestID: {
            type: z.string(),
            description: "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
        },
        range: {
            type: z.enum([
                StatisticRange.LastHour,
                StatisticRange.Last24Hours,
                StatisticRange.Last30Days,
                StatisticRange.Last7Days,
            ]),
            description: "历史数据统计范围，可选值为last_hour, last_24_hours, last_7_days, last_30_days，对应最近1小时、最近24小时、最近7天、最近30天。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法",
            example: StatisticRange.LastHour,
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            // 获取云主机规格信息
            const getGuestResult = await connector.getGuest(input.guestID);
            if (getGuestResult.error) {
                throw new Error(getGuestResult.error);
            }
            if (!getGuestResult.data) {
                throw new Error(`找不到云主机配置`);
            }
            const spec = getGuestResult.data;
            // 调用queryResourceStatistic获取统计数据
            const result = await connector.queryResourceStatistic(input.guestID, input.range);
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data ||
                (Array.isArray(result.data) && result.data.length === 0)) {
                throw new Error(`统计用量数据缺失`);
            }
            const records = result.data.map((data) => marshalStatisticData(data, spec));
            return JSON.stringify(records);
        }
        catch (error) {
            const errorMsg = `获取云主机 ${input.guestID} 资源统计数据出错: ${error instanceof Error ? error.message : String(error)}`;
            logger.error(errorMsg);
            return errorMsg;
        }
    }
}
export default GetGuestStatisticUsageTool;
