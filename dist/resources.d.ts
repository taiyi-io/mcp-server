import { FileRecord, TaiyiConnector } from "@taiyi-io/api-connector-ts";
import { ResourceContent } from "mcp-framework";
export declare function marshalFileRecord(file: FileRecord): string;
export declare function fetchAllDiskImages(connector: TaiyiConnector, selfOnly: boolean): Promise<ResourceContent[]>;
export declare function fetchAllISOImages(connector: TaiyiConnector, selfOnly: boolean): Promise<ResourceContent[]>;
