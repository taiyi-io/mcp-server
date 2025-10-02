import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
class DeleteDiskImageTool extends MCPTool {
    name = "delete-disk-image";
    description = "根据指定id删除磁盘镜像。可以通过mcp-tool:find-disk-image-id-by-name输入磁盘镜像名称获得磁盘镜像ID，再调用本接口";
    schema = {
        imageID: {
            type: z.string(),
            description: "磁盘镜像的ID。如果仅有磁盘镜像名称，可以通过mcp-tool:find-disk-image-id-by-name获取磁盘镜像ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            await connector.deleteDiskFile(input.imageID);
            return `成功删除磁盘镜像 ${input.imageID}`;
        }
        catch (error) {
            const output = `删除磁盘镜像失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default DeleteDiskImageTool;
