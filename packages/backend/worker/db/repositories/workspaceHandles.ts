import { concatMap, firstValueFrom, lastValueFrom } from "rxjs";
import { database } from "../database";
import { name, WorkspaceHandle } from "../stores/workspaceHandles";

export function getWorkspaceHandle(id: string) {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readonly")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>(name).get$(id)),
        ),
    );
}

export function getWorkspaceHandles() {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readonly")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>(name).getAll$()),
        ),
    );
}

export function addWorkspaceHandle(workspace: WorkspaceHandle) {
    return lastValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readwrite")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>(name).add$(workspace, workspace.id)),
        ),
    );
}
