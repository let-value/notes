import { Query } from "./Query";

export const frontend = {
    pickDirectory: new Query<FileSystemDirectoryHandle, FileSystemPermissionMode>("pickDirectory"),
};
