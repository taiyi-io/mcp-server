import { MCPResource, logger } from "mcp-framework";
import { getConnector } from "../server.js";
import { marshalGuestView, queryGuests } from "../utils.js";
/**
 * 云主机列表资源
 * 返回当前用户可以访问的所有云主机列表
 */
class GuestListResource extends MCPResource {
    uri = "resource://guest/";
    name = "云主机列表";
    description = "返回当前用户可以访问的所有云主机列表，包含主机名、标识、核心数、内存、磁盘配置和权限信息。";
    mimeType = "application/json";
    async read() {
        const connector = await getConnector();
        try {
            const allGuests = await queryGuests(connector, false);
            // 处理云主机数据
            const resources = [];
            allGuests.forEach((guest) => {
                if (guest.id !== undefined) {
                    const guestURI = `${this.uri}${guest.id}`;
                    const text = marshalGuestView(guest);
                    resources.push({
                        uri: guestURI,
                        mimeType: this.mimeType,
                        text: text,
                    });
                }
                else {
                    logger.warn("发现没有ID的云主机，跳过资源创建");
                }
            });
            return resources;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`读取云主机列表资源时发生错误: ${errorMessage}`);
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
export default GuestListResource;
