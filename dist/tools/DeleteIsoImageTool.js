import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
class DeleteIsoImageTool extends MCPTool {
    name = "delete-iso-image";
    description = "根据指定id删除ISO镜像";
    schema = {
        imageID: {
            type: z.string(),
            description: "ISO镜像的ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            await connector.deleteISOFile(input.imageID);
            return `成功删除ISO镜像 ${input.imageID}`;
        }
        catch (error) {
            const output = `删除ISO镜像失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default DeleteIsoImageTool;
