# 太一云 MCP-server

基于 Anthropic 推出的[MCP 协议](https://github.com/modelcontextprotocol)，由[太一云(https://www.taiyi.io)](https://www.taiyi.io) 提供的 MCP-server 实现。

允许大模型通过 MCP 协议，与太一云主控节点进行交互，实现对云计算集群、云主机、存储卷等资源的管理、运维和调度。可以让 AI Agent 具备自动调度管理云平台的能力，减轻运维压力和，提高云资源的利用率和效率。

## 部署

太一的 MCP 服务基于 Node.js 运行在 AI Agent 本地，通过 stdio 与 AI Agent 交互。同时通过 API 与太一云主控节点进行网络通信。

### 安装要求

- Node.js 20 或以上版本
- 支持 MCP 服务的 Agent，如 Claude Code、Cherry Studio、Roo 等
- 正常运行的太一云集群
- Agent 能够访问太一云主控节点 API 端口(默认 5851)
- 太一云 API 密钥(ACCESS_STRING)，通过管理门户:账号管理>访问令牌 创建

### MCP 配置

太一云 MCP 服务需要配置三个环境变量

- BACKEND_HOST: 太一云主控节点 IP 地址
- BACKEND_PORT: 太一云主控节点 API 端口(默认 5851)
- ACCESS_STRING: 太一云 API 密钥

打开 AI Agent 的 MCP 配置，替换实际值，添加以下内容：

```json
{
  "mcpServers": {
    ...
    "taiyi-cloud": {
      "command": "npx",
      "args": ["@taiyi-io/mcp-server"],
      "env": {
        "BACKEND_HOST": "192.168.3.99",
        "BACKEND_PORT": "5851",
        "ACCESS_STRING": "abcdefg"
      }
    }
    ...
  }
}
```

MCP 加载成功后，部分 Agent 能够自动识别并展示可用的 Resource 和 Tool，请有效利用，检查服务是否正常。

### 示例 prompt

主流大模型都具备自动选择和组合 mcp 服务的能力，以下是一些常用的 prompt，可以用于检验大模型和 AI Agent 适配能力：

- "基于 CentOS 7 的镜像，克隆一个 2 核 2GB 内存 20G 磁盘的云主机"
- "使用云主机 abc 创建磁盘镜像"
- "删除昨天创建并且不在运行中的云主机"

## 提供能力

太一云的 MCP 服务都提供了详细的功能和参数说明，可以利用[MCP Inspector](https://github.com/modelcontextprotocol/inspector)或者源代码进行查看和调试。

当前版本主要功能如下：

### 资源

- 磁盘镜像、光盘镜像、系统模板列表
- 云主机、资源节点、计算资源池、存储池列表
- 系统告警、日志、运行任务列表
- 集群、资源池、节点实时资源用量

### Tool

- 云主机：创建、删除、起停、详情、快照、镜像与克隆、媒体操作、磁盘与网卡管理、资源实时用量和历史统计；条件搜索、完整列表
- 磁盘镜像/光盘镜像：详情、列表、删除、条件搜索
- 系统模板：详情、列表、条件搜索
- 资源节点、资源池、存储池：详情、列表
- 任务：查询、详情、清除
