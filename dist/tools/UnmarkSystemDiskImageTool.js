import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { ResourceType } from "@taiyi-io/api-connector-ts";
class UnmarkSystemDiskImageTool extends MCPTool {
    name = "unmark-system-disk-image";
    description = "根据指定id取消磁盘镜像的系统标记";
    schema = {
        imageID: {
            type: z.string(),
            description: "磁盘镜像的ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            await connector.setSystemResource(ResourceType.DiskImage, input.imageID, false);
            return `成功取消磁盘镜像 ${input.imageID} 的系统磁盘镜像标记`;
        }
        catch (error) {
            const output = `取消系统磁盘镜像标记失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default UnmarkSystemDiskImageTool;
