import { Item } from "models";
import { Command } from "./Command";
import { Query } from "./Query";

export const frontend = {
    requestPermission: new Query<PermissionState, FileSystemDirectoryHandle>("requestPermission"),
    pickDirectory: new Query<FileSystemDirectoryHandle>("pickDirectory"),
    workspace: {
        files: new Command<Item[], string>("workspace/updateTreeItems"),
    },
};
