import {
  GuestSystemView,
  ResourceAction,
  TaiyiConnector,
} from "@taiyi-io/api-connector-ts";
import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { marshalPermissions } from "../utils.js";

function marshalSystemView(view: GuestSystemView): string {
  const obj: { [key: string]: any } = {};

  // 映射属性
  if (view.id !== undefined) {
    obj["标识"] = view.id;
  }

  if (view.label !== undefined) {
    obj["名称"] = view.label;
  }

  if (view.is_system === true) {
    obj["系统模板"] = true;
  }

  if (view.category !== undefined) {
    obj["操作系统"] = view.category;
  }

  if (view.removable !== undefined) {
    obj["光驱"] = view.removable;
  }

  if (view.disk !== undefined) {
    obj["磁盘"] = view.disk;
  }

  if (view.network !== undefined) {
    obj["网卡"] = view.network;
  }

  if (view.firmware !== undefined) {
    obj["启动方式"] = view.firmware;
  }

  marshalPermissions(view, obj);
  return JSON.stringify(obj);
}

interface GetSystemDetailInput {
  systemID: string;
}

class GetSystemDetailTool extends MCPTool<GetSystemDetailInput> {
  name = "get-system-detail";
  description =
    "根据指定id获取系统详情，包含标识、名称、操作系统、磁盘配置、网络配置和权限信息等";

  schema = {
    systemID: {
      type: z.string(),
      description: "系统的ID",
    },
  };

  async execute(input: GetSystemDetailInput) {
    try {
      const connector: TaiyiConnector = await getConnector();
      const result = await connector.getSystem(input.systemID);
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("未找到系统数据");
      }
      const view: GuestSystemView = result.data;
      const text = marshalSystemView(view);
      return text;
    } catch (error) {
      const output = `获取系统 ${input.systemID} 详情失败：${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(output);
      return output;
    }
  }
}

export default GetSystemDetailTool;
