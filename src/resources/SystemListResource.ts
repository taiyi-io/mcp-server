import { MCPResource, ResourceContent, logger } from "mcp-framework";
import {
  GuestSystemView,
  TaiyiConnector,
} from "@taiyi-io/api-connector-ts";
import { getConnector } from "../server.js";
import { getAllSystems, marshalSystemView } from "../utils.js";

/**
 * 系统模板列表资源
 * 返回当前用户可以访问的所有系统模板列表
 */
class SystemListResource extends MCPResource {
  uri = "resource://system/";
  name = "系统模板列表";
  description =
    "返回当前用户可以访问的所有系统模板列表，包含模板标识、名称、类型、操作系统、硬件配置和权限信息。通常用于创建云主机时选择系统模板。";
  mimeType = "application/json";

  async read(): Promise<ResourceContent[]> {
    const connector: TaiyiConnector = await getConnector();

    try {
      const allSystems = await getAllSystems(connector, false);
      // 处理系统模板数据
      const resources: ResourceContent[] = [];
      allSystems.forEach((system: GuestSystemView) => {
        if (!system.id) {
          throw new Error("系统模板ID不能为空");
        }
        const systemURI = `${this.uri}${system.id}`;
        const text = marshalSystemView(system);
        resources.push({
          uri: systemURI,
          mimeType: this.mimeType,
          text: text,
        });
      });

      return resources;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(`读取系统模板列表资源时发生错误: ${errorMessage}`);
      return [
        {
          uri: "",
          mimeType: "text/plain",
          text: errorMessage,
        },
      ];
    }
  }
}

export default SystemListResource;
