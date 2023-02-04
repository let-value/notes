import { ReactiveIDBDatabaseSchema } from "@creasource/reactive-idb";
import { gdriveWorkspaces } from "./stores/gdriveWorkspaces";
import { workspaceHandles } from "./stores/workspaceHandles";
import { workspaces } from "./stores/workspaces";

export const schema: ReactiveIDBDatabaseSchema = {
    version: 4,
    stores: [workspaces, workspaceHandles, gdriveWorkspaces],
};
