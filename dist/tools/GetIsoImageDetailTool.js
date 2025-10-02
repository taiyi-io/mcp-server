import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { marshalFileRecord } from "../utils.js";
class GetIsoImageDetailTool extends MCPTool {
    name = "get-iso-image-detail";
    description = "根据指定id获取ISO镜像详情，包含镜像容量、名称描述和创建修改时间信息。可以通过mcp-tool:find-iso-image-id-by-name输入ISO镜像名称获得ISO镜像ID，再调用本接口";
    schema = {
        imageID: {
            type: z.string(),
            description: "ISO镜像的ID。如果仅有ISO镜像名称，可以通过mcp-tool:find-iso-image-id-by-name获取ISO镜像ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const result = await connector.getISOFile(input.imageID);
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("未找到ISO镜像数据");
            }
            const image = result.data;
            const text = marshalFileRecord(image);
            return text;
        }
        catch (error) {
            const output = `获取ISO镜像 ${input.imageID} 详情失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GetIsoImageDetailTool;
