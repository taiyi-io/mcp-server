import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
class DeleteIsoImageTool extends MCPTool {
    name = "delete-iso-image";
    description = "根据指定id删除ISO镜像。可以通过mcp-tool:find-iso-image-id-by-name输入ISO镜像名称获得ISO镜像ID，再调用本接口";
    schema = {
        imageID: {
            type: z.string(),
            description: "ISO镜像的ID。如果仅有ISO镜像名称，可以通过mcp-tool:find-iso-image-id-by-name获取ISO镜像ID",
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
