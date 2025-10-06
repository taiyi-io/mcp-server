import { ConsoleEvent, FileRecord, FileView, GuestState, GuestSystemView, GuestView, ResourceAction, ResourcePermissions, TaiyiConnector, TaskData, TaskType } from "@taiyi-io/api-connector-ts";
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
export declare function getAllDiskImages(connector: TaiyiConnector, selfOnly: boolean): Promise<FileView[]>;
export declare function getAllISOImages(connector: TaiyiConnector, selfOnly: boolean): Promise<FileView[]>;
export declare function getAllSystems(connector: TaiyiConnector, selfOnly: boolean): Promise<GuestSystemView[]>;
export declare function findSystemIDByLabel(connector: TaiyiConnector, label: string): Promise<string>;
export declare function findGuestIDByName(connector: TaiyiConnector, name: string): Promise<string>;
export declare function findDiskImageIDByName(connector: TaiyiConnector, name: string): Promise<string>;
export declare function findISOImageIDByName(connector: TaiyiConnector, name: string): Promise<string>;
export declare function taskTypeName(taskType: TaskType): string;
export declare function marshalTaskStatus(task: TaskData): string;
export {};
