import { MCPResource, logger } from "mcp-framework";
import { ResourceAction, } from "@taiyi-io/api-connector-ts";
import { getConnector } from "../server.js";
import { queryGuests } from "../utils.js";
/**
 * 云主机视图转换函数
 * 将云主机对象转换为JSON字符串
 */
function marshalGuestView(view) {
    const obj = {};
    // 映射属性
    if (view.id !== undefined) {
        obj["标识"] = view.id;
    }
    if (view.name !== undefined) {
        obj["主机名"] = view.name;
    }
    if (view.cores !== undefined) {
        obj["核心数"] = view.cores;
    }
    if (view.memory !== undefined) {
        obj["内存"] = `${view.memory} MiB`;
    }
    // 处理磁盘信息
    if (view.disks && Array.isArray(view.disks)) {
        const diskSizes = [];
        view.disks.forEach((disk) => {
            if (disk.size) {
                const sizeInGB = (disk.size / 1024).toFixed(2);
                diskSizes.push(`${sizeInGB} GB`);
            }
        });
        if (diskSizes.length > 0) {
            obj["磁盘"] = diskSizes.join(", ");
        }
    }
    if (view.auto_start === true) {
        obj["开机启动"] = true;
    }
    if (view.media_attached === true) {
        obj["媒体已加载"] = true;
    }
    if (view.host_address !== undefined && view.host_address !== "") {
        obj["宿主机地址"] = view.host_address;
    }
    if (view.pool !== undefined && view.pool !== "") {
        obj["所属资源池"] = view.pool;
    }
    // 处理权限相关信息
    if (view.permissions && view.permissions.owner !== undefined) {
        obj["拥有者"] = view.permissions.owner;
    }
    // 处理操作权限
    if (view.actions && Array.isArray(view.actions)) {
        const permissions = [];
        if (view.actions.includes(ResourceAction.Edit)) {
            permissions.push("编辑");
        }
        if (view.actions.includes(ResourceAction.Delete)) {
            permissions.push("删除");
        }
        if (view.actions.includes(ResourceAction.View)) {
            permissions.push("浏览");
        }
        if (permissions.length > 0) {
            obj["权限"] = permissions.join("|");
        }
    }
    return JSON.stringify(obj);
}
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
