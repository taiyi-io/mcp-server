import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { findISOImageIDByName } from "../utils.js";
import { getConnector } from "../server.js";
class FindIsoImageIdByNameTool extends MCPTool {
    name = "find-iso-image-id-by-name";
    description = "通过ISO镜像名称查找ISO镜像ID。如果需要调用ISO镜像接口，只有ISO镜像名称而没有镜像id时，通过本接口获得正确id再调用目标tool";
    schema = {
        name: {
            type: z.string(),
            description: "ISO镜像名称",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const id = await findISOImageIDByName(connector, input.name);
            return `ISO镜像${input.name}的id为${id}`;
        }
        catch (error) {
            const output = error instanceof Error ? error.message : "查找ISO镜像ID失败";
            logger.error(output);
            return output;
        }
    }
}
export default FindIsoImageIdByNameTool;
