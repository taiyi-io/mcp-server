import { MCPResource } from "mcp-framework";
import { fetchAllDiskImages } from "../resources.js";
import { getConnector } from "../server.js";
class DiskImageListResource extends MCPResource {
    uri = "resource://disk-image/";
    name = "磁盘镜像列表";
    description = "获取所有磁盘镜像的列表";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        return await fetchAllDiskImages(connector, false);
    }
}
export default DiskImageListResource;
