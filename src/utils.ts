import {
  FileRecord,
  FileView,
  GuestFilter,
  GuestState,
  GuestView,
  ResourceAction,
  TaiyiConnector,
} from "@taiyi-io/api-connector-ts";

import { logger, ResourceContent } from "mcp-framework";

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
  obj["拥有者"] = file.permissions.owner;
  let permissions: string[] = [];
  if (file.actions && file.actions.includes(ResourceAction.Edit)) {
    permissions.push("编辑");
  }
  if (file.actions && file.actions.includes(ResourceAction.Delete)) {
    permissions.push("删除");
  }
  if (file.actions && file.actions.includes(ResourceAction.View)) {
    permissions.push("浏览");
  }
  obj["权限"] = permissions.join("|");

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
