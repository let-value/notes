import { Query } from "./Query";

export const frontend = {
    requestPermission: new Query<PermissionState, FileSystemDirectoryHandle>("requestPermission"),
    pickDirectory: new Query<FileSystemDirectoryHandle>("pickDirectory"),
};
