import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface GuestAddNetworkInterfaceInput {
  guestID: string;
  macAddress?: string;
  external?: boolean;
}

// 生成随机MAC地址的函数
function generateRandomMacAddress(): string {
  const macParts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const part = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    macParts.push(part);
  }
  // 确保是有效的本地管理地址（第二位为偶数）
  const secondChar = parseInt(macParts[0].charAt(1), 16);
  if (secondChar % 2 !== 0) {
    const firstPart = macParts[0].charAt(0) + (secondChar - 1).toString(16);
    macParts[0] = firstPart;
  }
  return macParts.join(":");
}

class GuestAddNetworkInterfaceTool extends MCPTool<GuestAddNetworkInterfaceInput> {
  name = "guest-add-network-interface";
  description =
    "指定云主机ID，添加网络接口到云主机。如果仅知道云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机id，再调用本方法";

  schema = {
    guestID: {
      type: z.string(),
      description:
        "云主机的ID。如果仅有云主机名称，可以通过mcp-tool:find-guest-id-by-name获取云主机ID",
    },
    macAddress: {
      type: z
        .string()
        .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
        .optional(),
      description:
        "目标网卡的MAC地址，格式为 xx:xx:xx:xx:xx:xx，未提供时将自动生成",
    },
    external: {
      type: z.boolean().optional(),
      description: "是否添加外部网卡，默认为true",
    },
  };

  async execute(input: GuestAddNetworkInterfaceInput) {
    try {
      const connector = await getConnector();
      const isExternal = input.external !== false; // 默认为true
      const macAddress = input.macAddress || generateRandomMacAddress();

      if (isExternal) {
        const result = await connector.addExternalInterface(
          input.guestID,
          macAddress
        );

        if (result.error) {
          throw new Error(result.error);
        }

        return `成功添加外部网卡 ${macAddress} 到云主机 ${input.guestID}`;
      } else {
        const result = await connector.addInternalInterface(
          input.guestID,
          macAddress
        );

        if (result.error) {
          throw new Error(result.error);
        }

        return `成功添加内部网卡 ${macAddress} 到云主机 ${input.guestID}`;
      }
    } catch (error) {
      const output = `添加网卡失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestAddNetworkInterfaceTool;
