import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
class GuestModifyMemoryTool extends MCPTool {
    name = "guest-modify-memory";
    description = "指定云主机ID和目标内存大小，修改云主机的内存容量，内存大小必须为2的倍数（MB）";
    schema = {
        guestID: {
            type: z.string(),
            description: "云主机的ID",
        },
        memoryMB: {
            type: z.string().refine((val) => {
                const num = parseInt(val);
                return !isNaN(num) && num >= 256 && num % 2 === 0;
            }, { message: "内存大小必须为大于等于256且为2的倍数的整数" }),
            description: "目标内存大小，以MB为单位，必须为2的倍数",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            // 将字符串转换为数字
            const memoryInMB = parseInt(input.memoryMB);
            const result = await connector.modifyGuestMemory(input.guestID, memoryInMB);
            if (result.error) {
                throw new Error(result.error);
            }
            const memoryGB = (memoryInMB / 1024).toFixed(1);
            return `成功将云主机 ${input.guestID} 的内存大小修改为 (${memoryGB} GB)`;
        }
        catch (error) {
            const output = `修改云主机内存大小失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GuestModifyMemoryTool;
