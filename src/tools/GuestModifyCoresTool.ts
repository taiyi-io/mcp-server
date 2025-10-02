import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface GuestModifyCoresInput {
  guestID: string;
  cores: string;
}

class GuestModifyCoresTool extends MCPTool<GuestModifyCoresInput> {
  name = "guest-modify-cores";
  description =
    "指定云主机ID和目标核心数，修改云主机的CPU核心数量，核心数必须是1或2的倍数。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
    },
    cores: {
      type: z.string().refine(
        (val) => {
          const num = parseInt(val);
          return !isNaN(num) && num >= 1 && (num === 1 || num % 2 === 0);
        },
        { message: "核心数必须是1或2的倍数" }
      ),
      description:
        "目标核心数，必须是1或2的倍数，且不能超过所在宿主机允许的最大核心数",
    },
  };

  async execute(input: GuestModifyCoresInput) {
    try {
      const connector = await getConnector();
      const cores = parseInt(input.cores);
      const result = await connector.modifyGuestCPU(input.guestID, cores);

      if (result.error) {
        throw new Error(result.error);
      }

      return `成功将云主机 ${input.guestID} 的CPU核心数修改为 ${input.cores} 核心`;
    } catch (error) {
      const output = `修改云主机CPU核心数失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestModifyCoresTool;
