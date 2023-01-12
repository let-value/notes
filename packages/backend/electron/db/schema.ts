import { ReactiveIDBDatabaseSchema, ReactiveIDBStoreSchema } from "@creasource/reactive-idb";
import { schema as originalSchema } from "backend-worker/db/schema";
import { workspaceHandles } from "./repositories";

const originalStores = originalSchema.stores.filter(
    (store: ReactiveIDBStoreSchema) => store.name !== "workspaceHandles",
);

export const schema: ReactiveIDBDatabaseSchema = {
    ...originalSchema,
    version: 1,
    stores: [...originalStores, workspaceHandles],
};
