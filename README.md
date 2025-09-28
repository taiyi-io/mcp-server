# 太一云 MCP-server

## 开发

### 调试

基于 Inspector

```bash
yarn dev
```

## 部署

参考配置：

```json
{
  "mcpServers": {
    "taiyi-cloud": {
      "command": "node",
      "args": ["/home/develop/develop/taiyi/mcp-server/dist/server.js"],
      "env": {
        "BACKEND_HOST": "192.168.1.40",
        "BACKEND_PORT": "5851",
        "ACCESS_STRING": "abcdefg"
      }
    }
  }
}
```
