import { ReactiveIDBStoreSchema } from "@creasource/reactive-idb";
import { Workspace } from "models";
import { concatMap, firstValueFrom, lastValueFrom } from "rxjs";
import { database } from "../database";

export interface WorkspaceHandle extends Workspace {
    path: string;
}

export const workspaceHandles: ReactiveIDBStoreSchema = {
    name: "workspaceHandles",
};

export function getWorkspaceHandle(id: string) {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaceHandles"], "readonly")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>("workspaceHandles").get$(id)),
        ),
    );
}

export function getWorkspaceHandles() {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaceHandles"], "readonly")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>("workspaceHandles").getAll$()),
        ),
    );
}

export function addWorkspaceHandles(workspace: WorkspaceHandle) {
    return lastValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaceHandles"], "readwrite")),
            concatMap((transaction) =>
                transaction.objectStore<WorkspaceHandle>("workspaceHandles").add$(workspace, workspace.id),
            ),
        ),
    );
}
