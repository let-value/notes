import { ReactiveIDBDatabaseSchema } from "@creasource/reactive-idb";
import { schema as originalSchema } from "backend-worker/db/schema";
import { workspaceHandles } from "./stores/workspaceHandles";

const originalStores = originalSchema.stores.filter(
    (store) => (typeof store === "object" ? store.name : store) !== "workspaceHandles",
);

export const schema: ReactiveIDBDatabaseSchema = {
    ...originalSchema,
    version: 1,
    stores: [...originalStores, workspaceHandles],
};
