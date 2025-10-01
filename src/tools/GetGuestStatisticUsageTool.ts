import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import {
  TaiyiConnector,
  ResourceStatisticUnit,
  StatisticRange,
  GuestSpec,
} from "@taiyi-io/api-connector-ts";
import { marshalDiskSpeed, marshalNetworkSpeed } from "../utils.js";

interface GetGuestStatisticUsageInput {
  guestID: string;
  range: string;
}
function marshalStatisticData(
  usage: ResourceStatisticUnit, // 使用ResourceStatisticUnit类型
  spec: GuestSpec
): { [key: string]: any } {
  const obj: { [key: string]: any } = {};
  const totalDisk = spec.disks.reduce((acc, disk) => acc + (disk.size || 0), 0);

  // CPU平均负载
  if (usage && usage.cores && usage.cores.average !== undefined) {
    obj["平均CPU负载"] = `${((usage.cores.average * spec.cores) / 100).toFixed(
      2
    )} / ${spec.cores} 核心`;
  }

  // 内存平均使用
  if (usage && usage.memory && usage.memory.average !== undefined) {
    obj["平均内存使用"] = `${(
      (usage.memory.average * spec.memory) /
      100
    ).toFixed(2)} / ${spec.memory} MB`;
  }

  // 磁盘平均使用
  if (usage && usage.disk && usage.disk.average !== undefined) {
    obj["平均磁盘使用"] = `${(
      (usage.disk.average * totalDisk) /
      100 /
      1024
    ).toFixed(2)} / ${(totalDisk / 1024).toFixed(2)} GB`;
  }

  obj["平均磁盘速度"] = marshalDiskSpeed(
    usage.readBytesPerSecond.average,
    usage.writeBytesPerSecond.average
  );

  obj["平均网络带宽"] = marshalNetworkSpeed(
    usage.receivedBytesPerSecond.average,
    usage.transmittedBytesPerSecond.average
  );
  obj["采集时间"] = new Date(usage.timestamp).toLocaleString();

  return obj;
}

class GetGuestStatisticUsageTool extends MCPTool<GetGuestStatisticUsageInput> {
  name = "get-guest-statistic-usage";
  description =
    "获取云主机的统计资源使用情况，包含CPU、内存、磁盘和网络的平均使用数据，通常用于分析云主机的历史性能表现";

  schema = {
    guestID: {
      type: z.string(),
      description: "云主机的ID",
    },
    range: {
      type: z.enum([
        StatisticRange.LastHour,
        StatisticRange.Last24Hours,
        StatisticRange.Last30Days,
        StatisticRange.Last7Days,
      ]),
      description: "时间范围",
      example: StatisticRange.LastHour,
    },
  };

  async execute(input: GetGuestStatisticUsageInput) {
    try {
      const connector: TaiyiConnector = await getConnector();

      // 获取云主机规格信息
      const getGuestResult = await connector.getGuest(input.guestID);
      if (getGuestResult.error) {
        throw new Error(getGuestResult.error);
      }
      if (!getGuestResult.data) {
        throw new Error(`找不到云主机配置`);
      }
      const spec: GuestSpec = getGuestResult.data;

      // 调用queryResourceStatistic获取统计数据
      const result = await connector.queryResourceStatistic(
        input.guestID,
        input.range as StatisticRange
      );

      if (result.error) {
        throw new Error(result.error);
      } else if (
        !result.data ||
        (Array.isArray(result.data) && result.data.length === 0)
      ) {
        throw new Error(`统计用量数据缺失`);
      }

      const records = result.data.map((data) =>
        marshalStatisticData(data, spec)
      );
      return JSON.stringify(records);
    } catch (error) {
      const errorMsg = `获取云主机 ${input.guestID} 资源统计数据出错: ${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(errorMsg);
      return errorMsg;
    }
  }
}

export default GetGuestStatisticUsageTool;
