import { WorkspaceHandle } from "@/domain";
import { concatMap, firstValueFrom, lastValueFrom } from "rxjs";
import { database } from "../database";

export function getWorkspace(id: string) {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readonly")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>("workspaces").get$(id)),
        ),
    );
}

export function getWorkspaces() {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readonly")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>("workspaces").getAll$()),
        ),
    );
}

export function addWorkspace(workspace: WorkspaceHandle) {
    return lastValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readwrite")),
            concatMap((transaction) =>
                transaction.objectStore<WorkspaceHandle>("workspaces").add$(workspace, workspace.id),
            ),
        ),
    );
}
