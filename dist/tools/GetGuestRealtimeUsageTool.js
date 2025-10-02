import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { GuestState, } from "@taiyi-io/api-connector-ts";
import { marshalDiskSpeed, marshalNetworkSpeed } from "../utils.js";
function marshalUsageDate(usage, spec) {
    const obj = {};
    const totalDisk = spec.disks.reduce((acc, disk) => acc + (disk.size || 0), 0);
    //usage的核心、内存、磁盘均为百分比利用率，0~100
    obj["CPU负载"] = `${((usage.cores * spec.cores) / 100).toFixed(2)} / ${spec.cores} 核心`;
    obj["内存负载"] = `${((usage.memory * spec.memory) / 100).toFixed(2)} / ${spec.memory} MB`;
    obj["磁盘负载"] = `${((usage.disk * totalDisk) / 100 / 1024).toFixed(2)} / ${totalDisk / 1024} GB`;
    obj["磁盘速度"] = marshalDiskSpeed(usage.readBytesPerSecond, usage.writeBytesPerSecond);
    obj["网络带宽"] = marshalNetworkSpeed(usage.receivedBytesPerSecond, usage.transmittedBytesPerSecond);
    obj["采集时间"] = new Date(usage.timestamp).toLocaleString();
    return JSON.stringify(obj);
}
class GetGuestRealtimeUsageTool extends MCPTool {
    name = "get-guest-realtime-usage";
    description = "获取云主机的实时资源使用情况，包含CPU、内存、磁盘负载和磁盘读写速度，网络收发带宽等信息，通常用于监控云主机的实时运行状态，仅限运行中云主机调用。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";
    schema = {
        guestID: {
            type: z.string(),
            description: "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const getResult = await connector.getGuest(input.guestID);
            if (getResult.error) {
                throw new Error(getResult.error);
            }
            if (!getResult.data) {
                throw new Error(`没有实时用量数据`);
            }
            const spec = getResult.data;
            if (spec.state !== GuestState.Running) {
                throw new Error(`云主机尚未运行`);
            }
            // 将单个guestID包装成数组传入queryResourceUsages
            const result = await connector.queryResourceUsages([input.guestID]);
            if (result.error) {
                throw new Error(result.error);
            }
            if (!result.data ||
                !Array.isArray(result.data) ||
                result.data.length === 0) {
                throw new Error("未找到云主机的实时资源使用数据");
            }
            // 取第一个元素并验证数据有效性
            const usageData = result.data[0];
            return marshalUsageDate(usageData, spec);
        }
        catch (error) {
            const errorMessage = `执行获取云主机 ${input.guestID} 实时资源使用数据时发生错误: ${error instanceof Error ? error.message : String(error)}`;
            logger.error(errorMessage);
            return errorMessage;
        }
    }
}
export default GetGuestRealtimeUsageTool;
