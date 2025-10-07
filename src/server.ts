#!/usr/bin/env node
import { MCPServer, logger } from "mcp-framework";
import {
  newInsecureConnector,
  TaiyiConnector,
} from "@taiyi-io/api-connector-ts";
import os from "os";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

//防止输出stdio干扰mcpserver
dotenv.config({ quiet: true });
let connector: TaiyiConnector | undefined = undefined;

export async function getConnector(): Promise<TaiyiConnector> {
  if (!connector) {
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
    connector = await newInsecureConnector(
      deviceID,
      accessString,
      backendHost,
      backendPort
    );
    logger.info(`Connector initialized with deviceID: ${deviceID}`);
  }
  return connector;
}

//initialize connector
await getConnector();
const __dirname = dirname(fileURLToPath(import.meta.url));
const server = new MCPServer({
  name: "taiyi-cloud",
  version: "0.10.2",
  basePath: __dirname,
});

server.start().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await server.stop();
});
