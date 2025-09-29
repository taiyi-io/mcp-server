import { MCPResource, ResourceContent } from "mcp-framework";
import { fetchAllDiskImages } from "../resources.js";
import { getConnector } from "../server.js";

class DiskImageListResource extends MCPResource {
  uri = "resource://disk-image/";
  name = "磁盘镜像列表";
  description =
    "返回当前用户可以访问的所有磁盘镜像列表，包含id、名称、描述、创建修改时间、容量信息";
  mimeType = "application/json";

  async read(): Promise<ResourceContent[]> {
    const connector = await getConnector();
    return await fetchAllDiskImages(connector, false);
  }
}

export default DiskImageListResource;
