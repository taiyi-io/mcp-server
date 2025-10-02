import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { findDiskImageIDByName } from "../utils.js";
import { getConnector } from "../server.js";
class FindDiskImageIdByNameTool extends MCPTool {
    name = "find-disk-image-id-by-name";
    description = "通过磁盘镜像名称查找磁盘镜像ID。如果需要调用磁盘镜像接口，只有镜像名称而没有指定id时，通过本接口获得正确id再调用目标tool";
    schema = {
        name: {
            type: z.string(),
            description: "磁盘镜像名称",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const id = await findDiskImageIDByName(connector, input.name);
            return `磁盘镜像${input.name}的id为${id}`;
        }
        catch (error) {
            const output = error instanceof Error ? error.message : "查找磁盘镜像ID失败";
            logger.error(output);
            return output;
        }
    }
}
export default FindDiskImageIdByNameTool;
