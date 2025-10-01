import { ConsoleEvent, FileRecord, FileView, GuestState, GuestView, ResourceAction, ResourcePermissions, TaiyiConnector } from "@taiyi-io/api-connector-ts";
interface priviledgeObject {
    permissions: ResourcePermissions;
    actions?: ResourceAction[];
}
export declare function marshalDiskSpeed(read_bytes_per_second: number, write_bytes_per_second: number): string;
export declare function marshalNetworkSpeed(received_bytes_per_second: number, transmitted_bytes_per_second: number): string;
export declare function marshalPermissions(value: priviledgeObject, obj: Record<string, any>): void;
export declare function marshalConsoleEvent(event: ConsoleEvent): string;
export declare function marshalFileView(file: FileView): string;
export declare function marshalFileRecord(file: FileRecord): string;
export declare function queryGuests(connector: TaiyiConnector, only_self?: boolean, keywords?: string[], pool?: string, node?: string, state?: GuestState): Promise<GuestView[]>;
export declare function marshalGuestView(view: GuestView): string;
export {};
