import { ConsoleEventLevel, ConsoleEventRange, GuestState, NodeMode, ResourceAction, TaskStatus, TaskType, } from "@taiyi-io/api-connector-ts";
export function marshalDiskSpeed(read_bytes_per_second, write_bytes_per_second) {
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
    }
    else if (diskMax < 1024 * 1024) {
        diskUnit = "KBps";
        diskMultiplier = 1024;
    }
    else if (diskMax < 1024 * 1024 * 1024) {
        diskUnit = "Mbps";
        diskMultiplier = 1024 * 1024;
    }
    else {
        diskUnit = "Gbps";
        diskMultiplier = 1024 * 1024 * 1024;
    }
    // 转换磁盘速率
    const diskReadConverted = (read_bytes_per_second / diskMultiplier).toFixed(2);
    const diskWriteConverted = (write_bytes_per_second / diskMultiplier).toFixed(2);
    return `读 ${diskReadConverted} / 写 ${diskWriteConverted} ${diskUnit}`;
}
export function marshalNetworkSpeed(received_bytes_per_second, transmitted_bytes_per_second) {
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
    }
    else if (netMax < 1000 * 1000) {
        netUnit = "mbps";
        netMultiplier = 1000;
    }
    else {
        netUnit = "gbps";
        netMultiplier = 1000 * 1000;
    }
    // 转换网络速率
    const netReceivedConverted = (netReceived / netMultiplier).toFixed(2);
    const netTransmittedConverted = (netTransmitted / netMultiplier).toFixed(2);
    return `接收 ${netReceivedConverted} / 发送 ${netTransmittedConverted} ${netUnit}`;
}
export function marshalPermissions(value, obj) {
    // owner的格式为user.namespace@domain，仅提取user部分展示
    if (value.permissions.owner) {
        const userPart = value.permissions.owner.split(".")[0];
        obj["拥有者"] = userPart;
    }
    let permissions = [];
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
export function marshalConsoleEvent(event) {
    const obj = {};
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
export function marshalFileView(file) {
    const obj = {};
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
export function marshalFileRecord(file) {
    const obj = {};
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
export async function queryGuests(connector, only_self, keywords, pool, node, state) {
    let allGuests = [];
    let offset = 0;
    const pageSize = 20;
    let total = 0;
    let filter = {};
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
    }
    else if (!firstResponse?.data) {
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
export function marshalGuestView(view) {
    const obj = {};
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
    let totalSize = 0;
    let diskLabels = [];
    view.disks.forEach((disk) => {
        if (disk.size) {
            totalSize += disk.size;
            diskLabels.push(`磁盘${disk.tag}: ${(disk.size / 1024).toFixed(2)} GB`);
        }
    });
    obj["磁盘"] = `总容量 ${(totalSize / 1024).toFixed(2)} GB, ${diskLabels.join(" /")}`;
    //网卡
    let netLabels = [];
    if (view.network_interfaces.external) {
        view.network_interfaces.external.forEach((net) => {
            let label = `外部网卡${net.mac_address}`;
            if (net.ip_address) {
                label += `, IPv4: ${net.ip_address}`;
            }
            if (net.ip_address_v6) {
                label += `, IPv6: ${net.ip_address_v6}`;
            }
            netLabels.push(label);
        });
    }
    if (view.network_interfaces.internal) {
        view.network_interfaces.internal.forEach((net) => {
            let label = `内部网卡${net.mac_address}`;
            if (net.ip_address) {
                label += `, IPv4: ${net.ip_address}`;
            }
            if (net.ip_address_v6) {
                label += `, IPv6: ${net.ip_address_v6}`;
            }
            netLabels.push(label);
        });
    }
    obj["网卡"] = netLabels.join(" /");
    obj["创建时间"] = new Date(view.created_time).toLocaleString();
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
export async function getAllDiskImages(connector, selfOnly) {
    let allImages = [];
    let offset = 0;
    const pageSize = 20;
    let total = 0;
    // 第一次请求获取总数
    const firstResponse = await connector.queryDiskFiles(offset, pageSize, selfOnly);
    if (firstResponse.error) {
        throw new Error(firstResponse.error);
    }
    else if (!firstResponse?.data) {
        throw new Error("获取磁盘镜像列表失败：返回数据为空");
    }
    total = firstResponse?.data?.total || 0;
    allImages = firstResponse?.data?.records
        ? [...firstResponse.data.records]
        : [];
    // 根据总数计算需要请求的偏移量
    const requests = [];
    offset += pageSize;
    // 从下一个偏移量开始请求剩余数据
    while (offset < total) {
        requests.push(connector.queryDiskFiles(offset, pageSize, selfOnly));
        offset += pageSize;
    }
    // 并行请求所有剩余页面
    if (requests.length > 0) {
        const responses = await Promise.all(requests);
        for (const response of responses) {
            //校验返回结果
            if (response.error) {
                throw new Error(response.error);
            }
            else if (!response?.data) {
                throw new Error("获取磁盘镜像列表失败：返回数据为空");
            }
            if (response?.data?.records) {
                allImages = [...allImages, ...response.data.records];
            }
        }
    }
    return allImages;
}
//getAllISOImages
export async function getAllISOImages(connector, selfOnly) {
    let allImages = [];
    let offset = 0;
    const pageSize = 20;
    let total = 0;
    // 第一次请求获取总数
    const firstResponse = await connector.queryISOFiles(offset, pageSize, selfOnly);
    if (firstResponse.error) {
        throw new Error(firstResponse.error);
    }
    else if (!firstResponse?.data) {
        throw new Error("获取ISO镜像列表失败：返回数据为空");
    }
    total = firstResponse?.data?.total || 0;
    allImages = firstResponse?.data?.records
        ? [...firstResponse.data.records]
        : [];
    // 根据总数计算需要请求的偏移量
    const requests = [];
    offset += pageSize;
    // 从下一个偏移量开始请求剩余数据
    while (offset < total) {
        requests.push(connector.queryISOFiles(offset, pageSize, selfOnly));
        offset += pageSize;
    }
    // 并行请求所有剩余页面
    if (requests.length > 0) {
        const responses = await Promise.all(requests);
        for (const response of responses) {
            //校验返回结果
            if (response.error) {
                throw new Error(response.error);
            }
            else if (!response?.data) {
                throw new Error("获取ISO镜像列表失败：返回数据为空");
            }
            if (response?.data?.records) {
                allImages = [...allImages, ...response.data.records];
            }
        }
    }
    return allImages;
}
export async function getAllSystems(connector, selfOnly) {
    let allSystems = [];
    let offset = 0;
    const pageSize = 20;
    let total = 0;
    // 第一次请求获取总数
    const firstResponse = await connector.querySystems(offset, pageSize, selfOnly);
    if (firstResponse.error) {
        throw new Error(firstResponse.error);
    }
    else if (!firstResponse?.data) {
        throw new Error("获取系统模板列表失败：返回数据为空");
    }
    total = firstResponse?.data?.total || 0;
    allSystems = firstResponse?.data?.records
        ? [...firstResponse.data.records]
        : [];
    // 根据总数计算需要请求的偏移量
    const requests = [];
    offset += pageSize;
    // 从下一个偏移量开始请求剩余数据
    while (offset < total) {
        requests.push(connector.querySystems(offset, pageSize, selfOnly));
        offset += pageSize;
    }
    // 并行请求所有剩余页面
    if (requests.length > 0) {
        const responses = await Promise.all(requests);
        for (const response of responses) {
            //校验返回结果
            if (response.error) {
                throw new Error(response.error);
            }
            else if (!response?.data) {
                throw new Error("获取云主机系统列表失败：返回数据为空");
            }
            if (response?.data?.records) {
                allSystems = [...allSystems, ...response.data.records];
            }
        }
    }
    return allSystems;
}
export async function findSystemIDByLabel(connector, label) {
    const systems = await getAllSystems(connector, false);
    const system = systems.find((s) => s.label === label);
    if (!system) {
        throw new Error(`未找到名称为 ${label} 的系统模板`);
    }
    return system.id || "";
}
//findGuestIDByName
export async function findGuestIDByName(connector, name) {
    const guests = await queryGuests(connector, false);
    const guest = guests.find((s) => s.name === name);
    if (!guest) {
        throw new Error(`未找到名称为 ${name} 的云主机`);
    }
    return guest.id;
}
//findDiskImageIDByName
export async function findDiskImageIDByName(connector, name) {
    const images = await getAllDiskImages(connector, false);
    const image = images.find((s) => s.name === name);
    if (!image) {
        throw new Error(`未找到名称为 ${name} 的磁盘镜像`);
    }
    return image.id;
}
//findISOImageIDByName
export async function findISOImageIDByName(connector, name) {
    const images = await getAllISOImages(connector, false);
    const image = images.find((s) => s.name === name);
    if (!image) {
        throw new Error(`未找到名称为 ${name} 的ISO镜像`);
    }
    return image.id;
}
export function taskTypeName(taskType) {
    switch (taskType) {
        case TaskType.CreateGuest:
            return "创建云主机";
        case TaskType.DeleteGuest:
            return "删除云主机";
        case TaskType.AddVolume:
            return "添加卷";
        case TaskType.DeleteVolume:
            return "删除卷";
        case TaskType.AddExternalInterface:
            return "添加外部接口";
        case TaskType.RemoveExternalInterface:
            return "移除外部接口";
        case TaskType.AddInternalInterface:
            return "添加内部接口";
        case TaskType.RemoveInternalInterface:
            return "移除内部接口";
        case TaskType.ModifyCPU:
            return "修改CPU";
        case TaskType.ModifyMemory:
            return "修改内存";
        case TaskType.ModifyHostname:
            return "修改主机名";
        case TaskType.ResetMonitor:
            return "重置监控密码";
        case TaskType.StartGuest:
            return "启动云主机";
        case TaskType.StopGuest:
            return "停止云主机";
        case TaskType.ModifyPassword:
            return "修改密码";
        case TaskType.ModifyAutoStart:
            return "修改自动启动";
        case TaskType.InsertMedia:
            return "插入介质";
        case TaskType.EjectMedia:
            return "弹出介质";
        case TaskType.ResizeDisk:
            return "调整磁盘大小";
        case TaskType.ShrinkDisk:
            return "收缩磁盘";
        case TaskType.InstallDiskImage:
            return "安装磁盘镜像";
        case TaskType.CreateDiskImage:
            return "创建磁盘镜像";
        case TaskType.SyncISOFiles:
            return "同步ISO文件";
        case TaskType.SyncDiskFiles:
            return "同步磁盘文件";
        case TaskType.CreateSnapshot:
            return "创建快照";
        case TaskType.DeleteSnapshot:
            return "删除快照";
        case TaskType.RestoreSnapshot:
            return "恢复快照";
        case TaskType.AddRemoteContainer:
            return "添加远程存储容器";
        case TaskType.ModifyRemoteContainer:
            return "修改远程存储容器";
        case TaskType.RemoveRemoteContainer:
            return "移除远程存储容器";
        case TaskType.ReloadResourceStorage:
            return "重新加载资源存储";
        case TaskType.ImportGuests:
            return "导入云主机";
        case TaskType.MigrateToNode:
            return "迁移到节点";
        default:
            return `未知任务类型: ${taskType}`;
    }
}
export function marshalTaskStatus(task) {
    const taskName = taskTypeName(task.type);
    // 根据任务状态返回不同的信息
    if (task.status === TaskStatus.Completed) {
        if (task.error) {
            return `任务${task.id} ${taskName}失败:${task.error}`;
        }
        else {
            return `任务${task.id} ${taskName}成功`;
        }
    }
    else if (task.status === TaskStatus.Pending) {
        return `任务${task.id} ${taskName} 正在等待执行`;
    }
    else if (task.status === TaskStatus.Running) {
        if (task.progress && task.progress > 0) {
            return `任务${task.id} ${taskName} 处理中：进度 ${task.progress} %`;
        }
        else {
            return `任务${task.id} ${taskName} 处理中...`;
        }
    }
    else {
        return `任务${task.id} ${taskName} 状态：${task.status}`;
    }
}
export function marshalComputePool(pool) {
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
export function marshalSystemView(view) {
    const obj = {};
    // 映射属性
    if (view.id !== undefined) {
        obj["标识"] = view.id;
    }
    if (view.label !== undefined) {
        obj["名称"] = view.label;
    }
    if (view.is_system === true) {
        obj["系统模板"] = true;
    }
    if (view.category !== undefined) {
        obj["操作系统"] = view.category;
    }
    if (view.removable !== undefined) {
        obj["光驱"] = view.removable;
    }
    if (view.disk !== undefined) {
        obj["磁盘"] = view.disk;
    }
    if (view.network !== undefined) {
        obj["网卡"] = view.network;
    }
    if (view.firmware !== undefined) {
        obj["启动方式"] = view.firmware;
    }
    marshalPermissions(view, obj);
    return JSON.stringify(obj);
}
export function marshalNodeData(node) {
    const nodeData = {};
    // 映射属性
    if (node.mode === NodeMode.Control) {
        nodeData["模式"] = "主控节点";
    }
    else if (node.mode === NodeMode.Resource) {
        nodeData["模式"] = "资源节点";
    }
    if (node.id !== undefined) {
        nodeData["标识"] = node.id;
    }
    if (node.name !== undefined) {
        nodeData["名称"] = node.name;
    }
    if (node.host && node.port) {
        nodeData["服务地址"] = `${node.host}:${node.port}`;
    }
    if (node.pool !== undefined) {
        nodeData["所属资源池"] = node.pool;
    }
    if (node.disabled === true) {
        nodeData["已禁用"] = true;
    }
    nodeData["故障"] = `致命${node.critical}, 警报${node.alert}, 告警${node.warning}`;
    return JSON.stringify(nodeData);
}
/**
   * 分页获取所有任务列表
   * 参考getAllDiskImages实现
   */
export async function getAllTasks(connector) {
    let allTasks = [];
    let offset = 0;
    const pageSize = 20;
    let total = 0;
    // 第一次请求获取总数
    const firstResponse = await connector.queryTasks(offset, pageSize);
    if (firstResponse.error) {
        throw new Error(firstResponse.error);
    }
    else if (!firstResponse?.data) {
        throw new Error("获取任务列表失败：返回数据为空");
    }
    total = firstResponse?.data?.total || 0;
    allTasks = firstResponse?.data?.records
        ? [...firstResponse.data.records]
        : [];
    // 根据总数计算需要请求的偏移量
    const requests = [];
    offset += pageSize;
    // 从下一个偏移量开始请求剩余数据
    while (offset < total) {
        requests.push(connector.queryTasks(offset, pageSize));
        offset += pageSize;
    }
    // 并行请求所有剩余页面
    if (requests.length > 0) {
        const responses = await Promise.all(requests);
        for (const response of responses) {
            // 校验返回结果
            if (response.error) {
                throw new Error(response.error);
            }
            else if (!response?.data) {
                throw new Error("获取任务列表失败：返回数据为空");
            }
            if (response?.data?.records) {
                allTasks = [...allTasks, ...response.data.records];
            }
        }
    }
    return allTasks;
}
export function marshalStoragePool(pool) {
    const obj = {};
    obj["标识"] = pool.id;
    obj["类型"] = pool.type;
    obj["分配策略"] = pool.strategy;
    if (pool.description) {
        obj["描述"] = pool.description;
    }
    obj["存储容器数量"] = pool.containers;
    obj["已分配磁盘卷"] = pool.allocated_volumes;
    if (pool.used_size && pool.max_size) {
        obj["磁盘用量"] = `${(pool.used_size / 1024).toFixed(2)} / ${Math.ceil(pool.max_size / 1024)}GB`;
    }
    return JSON.stringify(obj);
}
