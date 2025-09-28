import { FileRecord, TaiyiConnector } from "@taiyi-io/api-connector-ts";
import { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
export declare function marshalFileRecord(file: FileRecord): string;
export declare function fetchAllDiskImages(connector: TaiyiConnector, selfOnly: boolean): Promise<ReadResourceResult>;
