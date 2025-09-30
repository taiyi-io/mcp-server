import { FileRecord, FileView, GuestState, GuestView, TaiyiConnector } from "@taiyi-io/api-connector-ts";
export declare function marshalFileView(file: FileView): string;
export declare function marshalFileRecord(file: FileRecord): string;
export declare function queryGuests(connector: TaiyiConnector, only_self?: boolean, keywords?: string[], pool?: string, node?: string, state?: GuestState): Promise<GuestView[]>;
