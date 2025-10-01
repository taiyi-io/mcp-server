import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";

interface GuestRemoveNetworkInterfaceInput {
  guestID: string;
  macAddress: string;
  external?: boolean;
}

class GuestRemoveNetworkInterfaceTool extends MCPTool<GuestRemoveNetworkInterfaceInput> {
  name = "guest-remove-network-interface";
  description =
    "指定云主机ID和网卡MAC地址，删除云主机的网络接口；支持删除外部网卡和内部网卡，通过external参数指定，默认删除外部网卡";

  schema = {
    guestID: {
      type: z.string(),
      description: "云主机的ID",
    },
    macAddress: {
      type: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
      description: "目标网卡的MAC地址，格式为 xx:xx:xx:xx:xx:xx",
    },
    external: {
      type: z.boolean().optional(),
      description: "是否删除外部网卡，默认为true",
    },
  };

  async execute(input: GuestRemoveNetworkInterfaceInput) {
    try {
      const connector = await getConnector();
      const isExternal = input.external !== false; // 默认为true

      if (isExternal) {
        const result = await connector.removeExternalInterface(
          input.guestID,
          input.macAddress
        );

        if (result.error) {
          throw new Error(result.error);
        }

        return `成功删除云主机 ${input.guestID} 的外部网卡 ${input.macAddress}`;
      } else {
        const result = await connector.removeInternalInterface(
          input.guestID,
          input.macAddress
        );

        if (result.error) {
          throw new Error(result.error);
        }

        return `成功删除云主机 ${input.guestID} 的内部网卡 ${input.macAddress}`;
      }
    } catch (error) {
      const output = `删除网卡失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GuestRemoveNetworkInterfaceTool;
