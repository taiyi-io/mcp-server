import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
function marshalStoragePool(pool) {
    const obj = {};
    // 基本信息
    obj["标识"] = pool.id;
    obj["类型"] = pool.type;
    obj["分配策略"] = pool.strategy;
    if (pool.description) {
        obj["描述"] = pool.description;
    }
    // 遍历containers，输出每个container的相关信息
    if (pool.containers &&
        Array.isArray(pool.containers) &&
        pool.containers.length > 0) {
        let containers = [];
        pool.containers.forEach((container, index) => {
            let text = `容器${index + 1}：${container.uri}`;
            if (container.used_size && container.max_size) {
                text += `，已使用 ${(container.used_size / 1024).toFixed(2)} / ${Math.ceil(container.used_size / 1024)} GB`;
            }
            containers.push(text);
        });
        obj["存储"] = containers.join("\n");
    }
    return JSON.stringify(obj);
}
class GetStorageDetailTool extends MCPTool {
    name = "get-storage-detail";
    description = "根据指定id获取存储池详情，包含标识、类型、分配策略、描述和容器资源用量列表，通常用于检查后端存储负载和存储用量";
    schema = {
        storagePoolID: {
            type: z.string(),
            description: "存储池的ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const result = await connector.getStoragePool(input.storagePoolID);
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("未找到存储池数据");
            }
            const pool = result.data;
            const text = marshalStoragePool(pool);
            return text;
        }
        catch (error) {
            const output = `获取存储池 ${input.storagePoolID} 详情失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GetStorageDetailTool;
