import { logger, MCPResource, ResourceContent } from "mcp-framework";
import { getAllDiskImages, marshalFileView } from "../utils.js";
import { getConnector } from "../server.js";
import { TaiyiConnector } from "@taiyi-io/api-connector-ts";

async function fetchAllDiskImages(
  connector: TaiyiConnector,
  selfOnly: boolean
): Promise<ResourceContent[]> {
  try {
    const allImages = await getAllDiskImages(connector, selfOnly);
    // 构建返回多个resource对象，按照指定格式
    const resourcesList: ResourceContent[] = allImages.map((image) => {
      const imageURI = `resource://disk-image/${image.id}/detail`;
      const text = marshalFileView(image);
      return {
        uri: imageURI,
        mimeType: "application/json",
        text: text,
      };
    });

    return resourcesList;
  } catch (error) {
    const output = `获取磁盘镜像列表失败：${
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

class DiskImageListResource extends MCPResource {
  uri = "resource://disk-image/";
  name = "磁盘镜像列表";
  description =
    "返回当前用户可以访问的所有磁盘镜像列表，包含id、名称、描述、创建修改时间、容量信息。通常用于创建云主机时，选择目标镜像，然后使用磁盘镜像id调用创建云主机指令";
  mimeType = "application/json";

  async read(): Promise<ResourceContent[]> {
    const connector = await getConnector();
    return await fetchAllDiskImages(connector, false);
  }
}

export default DiskImageListResource;
