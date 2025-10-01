import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
function marshalComputePool(pool) {
    const obj = {};
    obj["标识"] = pool.id;
    if (pool.description) {
        obj["描述"] = pool.description;
    }
    if (pool.storage) {
        obj["存储池"] = pool.storage;
    }
    if (pool.address) {
        obj["地址池"] = pool.address;
    }
    if (pool.disabled === true) {
        obj["已禁用"] = "是";
    }
    if (pool.merge_memory === true) {
        obj["支持内存合并"] = "是";
    }
    if (pool.nodes && pool.nodes.length > 0) {
        obj["节点"] = pool.nodes.join(",");
    }
    if (pool.resource) {
        obj["云主机容量"] = pool.resource.guests;
        obj["最大核心数"] = pool.resource.cores;
        obj["最大内存"] = `${pool.resource.memory}MB`;
        // 将MB转换为GB并保留两位小数
        const diskInGB = (pool.resource.disk / 1024).toFixed(2);
        obj["最大磁盘"] = `${diskInGB}GB`;
    }
    return JSON.stringify(obj);
}
class GetComputePoolDetailTool extends MCPTool {
    name = "get-compute-pool-detail";
    description = "根据指定id获取计算资源池详情，包含标识、描述、存储池、地址池、状态和资源限制信息，通常用于选择和判断计算资源池";
    schema = {
        poolID: {
            type: z.string(),
            description: "计算资源池的ID",
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            const result = await connector.getComputePool(input.poolID);
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("未找到计算资源池数据");
            }
            const pool = result.data;
            const text = marshalComputePool(pool);
            return text;
        }
        catch (error) {
            const output = `获取计算资源池 ${input.poolID} 详情失败：${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GetComputePoolDetailTool;
