import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { ResourceType } from "@taiyi-io/api-connector-ts";
class MarkSystemIsoImageTool extends MCPTool {
    name = "mark-system-iso-image";
    description = "根据指定id将ISO镜像标记为系统ISO镜像";
    schema = {
        imageID: {
            type: z.string(),
            description: "ISO镜像的ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            await connector.setSystemResource(ResourceType.ISOImage, input.imageID, true);
            return `成功将ISO镜像 ${input.imageID} 标记为系统ISO镜像`;
        }
        catch (error) {
            const output = `标记系统ISO镜像失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default MarkSystemIsoImageTool;
