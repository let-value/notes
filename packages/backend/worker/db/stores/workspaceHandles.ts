import { ReactiveIDBStoreSchema } from "@creasource/reactive-idb";
import { Workspace } from "models";

export interface WorkspaceHandle extends Workspace {
    handle: FileSystemDirectoryHandle;
}

export const name = "workspaceHandles";

export const workspaceHandles: ReactiveIDBStoreSchema = {
    name,
};
