import { ReactiveIDBDatabaseSchema } from "@creasource/reactive-idb";
import { workspaces } from "./stores/workspaces";

export const schema: ReactiveIDBDatabaseSchema = {
    version: 1,
    stores: [workspaces],
};
