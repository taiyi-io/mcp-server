import { logger, MCPResource, ResourceContent } from "mcp-framework";
import { getConnector } from "../server.js";
import { FileView, TaiyiConnector } from "@taiyi-io/api-connector-ts";
import { getAllISOImages, marshalFileView } from "../utils.js";

async function fetchAllISOImages(
  connector: TaiyiConnector,
  selfOnly: boolean
): Promise<ResourceContent[]> {
  try {
    const allImages: FileView[] = await getAllISOImages(connector, selfOnly);

    // 构建返回多个resource对象，按照指定格式
    const resourcesList: ResourceContent[] = allImages.map((image) => {
      const imageURI = `resource://iso-image/${image.id}/detail`;
      const text = marshalFileView(image);
      return {
        uri: imageURI,
        mimeType: "application/json",
        text: text,
      };
    });

    return resourcesList;
  } catch (error) {
    const output = `获取ISO镜像列表失败：${
      error instanceof Error ? error.message : String(error)
    }`;
    logger.error(output);
    return [
      {
        uri: "",
        mimeType: "text/plain",
        text: output,
      },
    ];
  }
}

class IsoImageResourceList extends MCPResource {
  uri = "resource://iso-image/";
  name = "ISO镜像列表";
  description =
    "获取所有ISO镜像的列表，通常用于启动云主机或者加载光盘时，让用户选择目标iso镜像，然后使用镜像id调用启动云主机或者加载光盘指令";
  mimeType = "application/json";

  async read(): Promise<ResourceContent[]> {
    const connector = await getConnector();
    return await fetchAllISOImages(connector, false);
  }
}

export default IsoImageResourceList;
