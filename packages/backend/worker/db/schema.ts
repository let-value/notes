import { ReactiveIDBDatabaseSchema } from "@creasource/reactive-idb";
import { workspaceHandles } from "./stores/workspaceHandles";
import { workspaces } from "./stores/workspaces";

export const schema: ReactiveIDBDatabaseSchema = {
    version: 3,
    stores: [workspaces, workspaceHandles],
};
