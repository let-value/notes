import { ReactiveIDBStoreSchema } from "@creasource/reactive-idb";
import { gdrive, Workspace } from "models";
import { User } from "oidc-client-ts";

export interface GDriveWorkspace extends Workspace {
    root: gdrive.File;
    user: User;
}

export const name = "gdriveWorkspaces";

export const gdriveWorkspaces: ReactiveIDBStoreSchema = {
    name,
};
