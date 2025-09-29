import { MCPResource } from "mcp-framework";
import { getConnector } from "../server.js";
import { fetchAllISOImages } from "../resources.js";
class IsoImageResourceList extends MCPResource {
    uri = "resource://iso-image/";
    name = "ISO镜像列表";
    description = "获取所有ISO镜像的列表";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        return await fetchAllISOImages(connector, false);
    }
}
export default IsoImageResourceList;
