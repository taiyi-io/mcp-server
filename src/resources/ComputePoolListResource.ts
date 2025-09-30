import { MCPResource, ResourceContent, logger } from "mcp-framework";
import { TaiyiConnector, ComputePoolStatus } from "@taiyi-io/api-connector-ts";
import { getConnector } from "../server.js";

/**
 * 将ComputePoolStatus对象转换为JSON字符串
 */
function marshalComputePool(pool: ComputePoolStatus): string {
  const obj: { [key: string]: any } = {};
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

/**
 * 计算资源池列表资源
 * 返回当前用户可以访问的所有计算资源池列表
 */
class ComputePoolListResource extends MCPResource {
  uri = "resource://compute-pool/";
  name = "计算资源池列表";
  description =
    "返回当前用户可以访问的所有计算资源池列表，包含标识、描述、存储池、地址池、状态和资源限制信息。通常用于创建云主机时，选择目标资源池。";
  mimeType = "application/json";

  async read(): Promise<ResourceContent[]> {
    const connector: TaiyiConnector = await getConnector();
    try {
      // 调用queryComputePools一次性获取所有计算资源池
      const result = await connector.queryComputePools();
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("获取计算资源池列表失败：返回数据为空");
      }

      const pools: ComputePoolStatus[] = result.data;

      // 构建返回多个resource对象，按照指定格式
      const resourcesList: ResourceContent[] = pools.map((pool) => {
        const poolURI = `resource://compute-pool/${pool.id}/detail`;
        const text = marshalComputePool(pool);
        return {
          uri: poolURI,
          mimeType: "application/json",
          text: text,
        };
      });

      return resourcesList;
    } catch (error) {
      const output = `获取计算资源池列表失败：${
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
}

export default ComputePoolListResource;
