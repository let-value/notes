import { gdrive, Item } from "models";
import { User } from "oidc-client-ts";
import { Command } from "../../Command";
import { Query } from "../../Query";

export const frontend = {
    requestPermission: new Query<PermissionState, FileSystemDirectoryHandle>("requestPermission"),
    pickDirectory: {
        local: new Query<FileSystemDirectoryHandle>("pickDirectory/local"),
        gdrive: new Query<gdrive.File, { root: gdrive.File; user: User }>("pickDirectory/gdrive"),
    },
    oidc: {
        gdrive: new Query<User, User>("oidc/gdrive"),
    },
    workspace: {
        files: new Command<Item[], string>("workspace/updateTreeItems"),
    },
};
