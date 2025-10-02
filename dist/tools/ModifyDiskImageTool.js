import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
class ModifyDiskImageTool extends MCPTool {
    name = "modify-disk-image";
    description = "指定id，修改磁盘镜像的名称、描述和标签信息。可以通过mcp-tool:find-disk-image-id-by-name输入磁盘镜像名称获得磁盘镜像ID，再调用本接口";
    schema = {
        imageID: {
            type: z.string(),
            description: "磁盘镜像的ID。如果仅有磁盘镜像名称，可以通过mcp-tool:find-disk-image-id-by-name获取磁盘镜像ID",
        },
        name: {
            type: z.string().nonempty(),
            description: "磁盘镜像的名称（必填非空）",
        },
        description: {
            type: z.string().optional(),
            description: "磁盘镜像的描述",
        },
        tags: {
            type: z.array(z.string()).optional(),
            description: "磁盘镜像的标签列表",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const fileSpec = {
                name: input.name,
                description: input.description,
                tags: input.tags,
            };
            await connector.modifyDiskFile(input.imageID, fileSpec);
            return `成功修改磁盘镜像 ${input.imageID} 的信息`;
        }
        catch (error) {
            const output = `修改磁盘镜像信息失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default ModifyDiskImageTool;
