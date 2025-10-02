import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
class GuestCreateSnapshotTool extends MCPTool {
    name = "guest-create-snapshot";
    description = "创建云主机快照，支持同步等待结果";
    schema = {
        guestID: {
            type: z.string(),
            description: "目标云主机ID，如果仅有名称，可以通过mcp-tool:find-guest-id-by-name获取ID",
        },
        label: {
            type: z.string(),
            description: "快照名称",
        },
        description: {
            type: z.string().optional(),
            description: "快照描述",
        },
        sync: {
            type: z.boolean().optional(),
            description: "是否同步等待结果，默认否",
            default: false,
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            // 调用connector创建云主机快照，目前description参数不支持，仅使用label
            const result = await connector.tryCreateSnapshot(input.guestID, input.label);
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("创建快照失败：获取任务ID失败");
            }
            const taskID = result.data;
            // 异步处理情况
            if (!input.sync) {
                return `开始创建快照，ID：${taskID}，调用mcp-tool:check-task检查执行结果`;
            }
            // 同步等待结果，等待20分钟，间隔10秒
            const waitTimeout = 10 * 60;
            const waitInterval = 5;
            const taskResult = await connector.waitTask(taskID, waitTimeout, waitInterval);
            if (taskResult.error) {
                throw new Error(taskResult.error);
            }
            return `云主机${input.guestID}快照创建成功`;
        }
        catch (error) {
            const output = `创建云主机快照失败: ${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GuestCreateSnapshotTool;
