import {
  ConsoleEvent,
  ConsoleEventLevel,
  ConsoleEventRange,
  FileRecord,
  FileView,
  GuestFilter,
  GuestState,
  GuestView,
  ResourceAction,
  ResourcePermissions,
  TaiyiConnector,
} from "@taiyi-io/api-connector-ts";

interface priviledgeObject {
  permissions: ResourcePermissions;
  actions?: ResourceAction[];
}

export function marshalDiskSpeed(
  read_bytes_per_second: number,
  write_bytes_per_second: number
): string {
  //网络与磁盘分开处理
  //1.找出read_bytes_per_second和write_bytes_per_second的最大值
  //2.根据最大值判断速率应该是KBps、Mbps还是Gbps
  //3，根据速率统一转换 磁盘带宽 : 读 xx / 写 xx mbps
  //网络使用received_bytes_per_second和transmitted_bytes_per_second，单位是bps、mbps、gbps
  // 磁盘IO处理
  const diskMax = Math.max(read_bytes_per_second, write_bytes_per_second);

  // 确定磁盘速率单位
  let diskUnit = "";
  let diskMultiplier = 1;
  if (diskMax < 1024) {
    diskUnit = "bps";
    diskMultiplier = 1;
  } else if (diskMax < 1024 * 1024) {
    diskUnit = "KBps";
    diskMultiplier = 1024;
  } else if (diskMax < 1024 * 1024 * 1024) {
    diskUnit = "Mbps";
    diskMultiplier = 1024 * 1024;
  } else {
    diskUnit = "Gbps";
    diskMultiplier = 1024 * 1024 * 1024;
  }

  // 转换磁盘速率
  const diskReadConverted = (read_bytes_per_second / diskMultiplier).toFixed(2);
  const diskWriteConverted = (write_bytes_per_second / diskMultiplier).toFixed(
    2
  );
  return `读 ${diskReadConverted} / 写 ${diskWriteConverted} ${diskUnit}`;
}

export function marshalNetworkSpeed(
  received_bytes_per_second: number,
  transmitted_bytes_per_second: number
): string {
  // 网络IO处理
  const netReceived = received_bytes_per_second;
  const netTransmitted = transmitted_bytes_per_second;
  const netMax = Math.max(netReceived, netTransmitted);

  // 确定网络速率单位
  let netUnit = "";
  let netMultiplier = 1;
  if (netMax < 1000) {
    netUnit = "bps";
    netMultiplier = 1;
  } else if (netMax < 1000 * 1000) {
    netUnit = "mbps";
    netMultiplier = 1000;
  } else {
    netUnit = "gbps";
    netMultiplier = 1000 * 1000;
  }

  // 转换网络速率
  const netReceivedConverted = (netReceived / netMultiplier).toFixed(2);
  const netTransmittedConverted = (netTransmitted / netMultiplier).toFixed(2);
  return `接收 ${netReceivedConverted} / 发送 ${netTransmittedConverted} ${netUnit}`;
}

export function marshalPermissions(
  value: priviledgeObject,
  obj: Record<string, any>
) {
  obj["拥有者"] = value.permissions.owner;
  let permissions: string[] = [];
  if (value.actions && value.actions.includes(ResourceAction.Edit)) {
    permissions.push("编辑");
  }
  if (value.actions && value.actions.includes(ResourceAction.Delete)) {
    permissions.push("删除");
  }
  if (value.actions && value.actions.includes(ResourceAction.View)) {
    permissions.push("浏览");
  }
  obj["权限"] = permissions.join("|");
}

export function marshalConsoleEvent(event: ConsoleEvent): string {
  const obj: Record<string, any> = {};

  // 映射属性
  if (event.level) {
    switch (event.level) {
      case ConsoleEventLevel.Info:
        obj["级别"] = "信息";
        break;
      case ConsoleEventLevel.Warning:
        obj["级别"] = "告警";
        break;
      case ConsoleEventLevel.Alert:
        obj["级别"] = "警报";
        break;
      case ConsoleEventLevel.Critical:
        obj["级别"] = "致命";
        break;
      default:
        obj["级别"] = event.level;
        break;
    }
  }

  if (event.range) {
    switch (event.range) {
      case ConsoleEventRange.System:
        obj["范围"] = "系统";
        break;
      case ConsoleEventRange.Cluster:
        obj["范围"] = "集群";
        break;
      case ConsoleEventRange.Node:
        obj["范围"] = "节点";
        break;
      case ConsoleEventRange.Pool:
        obj["范围"] = "资源池";
        break;
      default:
        obj["范围"] = event.range;
        break;
    }
  }

  if (event.message !== undefined) {
    obj["内容"] = event.message;
  }

  if (event.timestamp !== undefined) {
    // 将RFC3339格式转换为本地时间
    const localTime = new Date(event.timestamp).toLocaleString();
    obj["时间"] = localTime;
  }
  return JSON.stringify(obj);
}
export function marshalFileView(file: FileView): string {
  const obj: { [key: string]: any } = {};
  obj["id"] = file.id;
  obj["镜像名"] = file.name;
  if (file.description) {
    obj["描述"] = file.description;
  }
  if (file.volume_size_in_mb && file.volume_size_in_mb > 0) {
    const sizeInGB = (file.volume_size_in_mb / 1024).toFixed(2);
    obj["逻辑容量"] = `${sizeInGB}GB`;
  }
  if (file.size && file.size > 0) {
    const sizeInGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
    obj["物理文件大小"] = `${sizeInGB}GB`;
  }
  //创建时间
  if (file.created_time) {
    const localTime = new Date(file.created_time).toLocaleString();
    obj["创建时间"] = localTime;
  }
  if (file.modified_time) {
    const localTime = new Date(file.modified_time).toLocaleString();
    obj["修改时间"] = localTime;
  }
  if (file.is_system === true) {
    obj["系统镜像"] = "是";
  }
  marshalPermissions(file, obj);
  return JSON.stringify(obj);
}

export function marshalFileRecord(file: FileRecord): string {
  const obj: { [key: string]: any } = {};
  obj["id"] = file.id;
  obj["镜像名"] = file.name;
  if (file.description) {
    obj["描述"] = file.description;
  }
  if (file.volume_size_in_mb && file.volume_size_in_mb > 0) {
    const sizeInGB = (file.volume_size_in_mb / 1024).toFixed(2);
    obj["逻辑容量"] = `${sizeInGB}GB`;
  }
  if (file.size && file.size > 0) {
    const sizeInGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
    obj["物理文件大小"] = `${sizeInGB}GB`;
  }
  //创建时间
  if (file.created_time) {
    const localTime = new Date(file.created_time).toLocaleString();
    obj["创建时间"] = localTime;
  }
  if (file.modified_time) {
    const localTime = new Date(file.modified_time).toLocaleString();
    obj["修改时间"] = localTime;
  }
  return JSON.stringify(obj);
} // 注册磁盘镜像列表资源

export async function queryGuests(
  connector: TaiyiConnector,
  only_self?: boolean,
  keywords?: string[],
  pool?: string,
  node?: string,
  state?: GuestState
): Promise<GuestView[]> {
  let allGuests: GuestView[] = [];
  let offset = 0;
  const pageSize = 20;
  let total = 0;
  let filter: GuestFilter = {};
  if (only_self) {
    filter.only_self = true;
  }
  if (keywords && keywords.length > 0) {
    filter.keywords = keywords;
    filter.by_keywords = true;
  }
  if (state) {
    filter.state = state;
    filter.by_state = true;
  }
  if (pool) {
    filter.pool = pool;
    filter.by_pool = true;
  }
  if (node) {
    filter.node = node;
    filter.by_node = true;
  }

  // 第一次请求获取总数
  const firstResponse = await connector.queryGuests(offset, pageSize, filter);

  if (firstResponse.error) {
    throw new Error(firstResponse.error);
  } else if (!firstResponse?.data) {
    throw new Error("获取云主机列表失败：返回数据为空");
  }

  total = firstResponse?.data?.total || 0;
  allGuests = firstResponse?.data?.records
    ? [...firstResponse.data.records]
    : [];

  // 根据总数计算需要请求的偏移量
  const requests = [];
  offset += pageSize;
  // 从下一个偏移量开始请求剩余数据
  while (offset < total) {
    requests.push(connector.queryGuests(offset, pageSize, filter));
    offset += pageSize;
  }
  // 并行请求所有剩余页面
  if (requests.length > 0) {
    const responses = await Promise.all(requests);
    for (const response of responses) {
      if (response?.data?.records) {
        allGuests = [...allGuests, ...response.data.records];
      }
    }
  }
  return allGuests;
}

export function marshalGuestView(view: GuestView): string {
  const obj: { [key: string]: any } = {};

  // 映射属性
  if (view.id !== undefined) {
    obj["标识"] = view.id;
  }

  if (view.name !== undefined) {
    obj["主机名"] = view.name;
  }

  switch (view.state) {
    case GuestState.Running:
      obj["状态"] = "运行中";
      break;
    case GuestState.Stopped:
      obj["状态"] = "已停止";
      break;
    case GuestState.Starting:
      obj["状态"] = "启动中";
      break;
    case GuestState.Stopping:
      obj["状态"] = "停止中";
      break;
    case GuestState.Suspending:
      obj["状态"] = "挂起中";
      break;
    case GuestState.Suspended:
      obj["状态"] = "已挂起";
      break;
    default:
      obj["状态"] = view.state;
  }

  if (view.cores !== undefined) {
    obj["核心数"] = view.cores;
  }

  if (view.memory !== undefined) {
    obj["内存"] = `${view.memory} MiB`;
  }

  // 处理磁盘信息
  if (view.disks && Array.isArray(view.disks)) {
    const diskSizes: string[] = [];
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

  marshalPermissions(view, obj);

  return JSON.stringify(obj);
}
