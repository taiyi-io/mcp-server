import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  FileStatus,
  FileView,
  newInsecureConnector,
  ResourceType,
} from "@taiyi-io/api-connector-ts";
import os from "os";
import dotenv from "dotenv";
import { fetchAllDiskImages, marshalFileRecord } from "./resources.js";

dotenv.config();

if (!process.env.ACCESS_STRING) {
  throw new Error("ACCESS_STRING is required");
}
if (!process.env.BACKEND_HOST) {
  throw new Error("BACKEND_HOST is required");
}
if (!process.env.BACKEND_PORT) {
  throw new Error("BACKEND_PORT is required");
}
// 检查 BACKEND_PORT 是否为有效的整数
const backendPort = parseInt(process.env.BACKEND_PORT || "", 10);
if (isNaN(backendPort)) {
  throw new Error("BACKEND_PORT must be an integer");
}
// 检查 BACKEND_PORT 是否在有效范围内
if (backendPort < 0 || backendPort > 65535) {
  throw new Error("BACKEND_PORT must be between 0 and 65535");
}

const deviceID = os.hostname();
const accessString = process.env.ACCESS_STRING;
const backendHost = process.env.BACKEND_HOST;
const connector = await newInsecureConnector(
  deviceID,
  accessString,
  backendHost,
  backendPort
);

const server = new McpServer({
  name: "taiyi-cloud",
  version: "0.11.0",
});

// 注册磁盘镜像列表资源
server.registerResource(
  "disk-images",
  "disk-images://",
  {
    title: "磁盘镜像列表",
    description: "获取所有磁盘镜像的列表",
    mimeType: "text/plain",
  },
  async () => {
    const result = await fetchAllDiskImages(connector, false);
    return result;
  }
);

// 注册单个磁盘镜像资源
server.registerResource(
  "disk-image-detail",
  new ResourceTemplate("disk-images://{id}/detail", { list: undefined }),
  {
    title: "磁盘镜像详情",
    description: "获取特定磁盘镜像的详细信息",
    mimeType: "text/plain",
  },
  async (uri, { id }) => {
    try {
      // 确保id是字符串类型
      const fileId = Array.isArray(id) ? id[0] : id;
      const result = await connector.getDiskFile(fileId);
      if (result.error) {
        throw new Error(result.error);
      } else if (!result.data) {
        throw new Error("未找到磁盘镜像数据");
      }
      const image: FileStatus = result.data;
      const text = marshalFileRecord(image);

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: text,
          },
        ],
      };
    } catch (error) {
      console.error(`获取磁盘镜像 ${id} 详情失败：`, error);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/plain",
            text: `获取磁盘镜像 ${id} 详情失败：${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

// 注册标记系统磁盘镜像工具
server.registerTool(
  "markSystemDiskImage",
  {
    title: "标记系统磁盘镜像",
    description: "将指定的磁盘镜像标记为系统磁盘镜像",
    inputSchema: {
      fileId: z.string().describe("磁盘镜像的ID"),
    },
  },
  async ({ fileId }) => {
    try {
      await connector.setSystemResource(ResourceType.DiskImage, fileId, true);
      return {
        content: [
          {
            type: "text",
            text: `成功将磁盘镜像 ${fileId} 标记为系统磁盘镜像`,
          },
        ],
      };
    } catch (error) {
      console.error(`标记系统磁盘镜像失败：`, error);
      return {
        content: [
          {
            type: "text",
            text: `标记系统磁盘镜像失败：${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

// 注册取消标记系统磁盘镜像工具
server.registerTool(
  "unmarkSystemDiskImage",
  {
    title: "取消系统磁盘镜像标记",
    description: "取消指定的系统磁盘镜像标记",
    inputSchema: {
      fileId: z.string().describe("磁盘镜像的ID"),
    },
  },
  async ({ fileId }) => {
    try {
      await connector.setSystemResource(ResourceType.DiskImage, fileId, false);
      return {
        content: [
          {
            type: "text",
            text: `成功取消磁盘镜像 ${fileId} 的系统磁盘镜像标记`,
          },
        ],
      };
    } catch (error) {
      console.error(`取消系统磁盘镜像标记失败：`, error);
      return {
        content: [
          {
            type: "text",
            text: `取消系统磁盘镜像标记失败：${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

// 注册标记系统磁盘镜像提示词
server.registerPrompt(
  "markSystemDiskImagePrompt",
  {
    title: "标记系统磁盘镜像",
    description:
      "从资源列表获取磁盘镜像ID后，调用tools将指定的磁盘镜像标记为系统磁盘镜像",
    argsSchema: {
      imageName: z.string(),
    },
  },
  ({ imageName }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `从镜像列表获取名称为 ${imageName} 的磁盘镜像ID，然后调用markSystemDiskImage标记为系统镜像`,
        },
      },
    ],
  })
);

// 注册取消标记系统磁盘镜像提示词
server.registerPrompt(
  "unmarkSystemDiskImagePrompt",
  {
    title: "取消系统磁盘镜像标记",
    description:
      "从资源列表获取磁盘镜像ID后，调用tools取消指定磁盘镜像的系统标记",
    argsSchema: {
      imageName: z.string(),
    },
  },
  ({ imageName }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `从镜像列表获取名称为 ${imageName} 的磁盘镜像ID，然后调用unmarkSystemDiskImage取消系统标记`,
        },
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
