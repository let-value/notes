import { Workspace } from "models";
import { concatMap, firstValueFrom, lastValueFrom } from "rxjs";
import { database } from "../database";

export function getWorkspace(id: string) {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readonly")),
            concatMap((transaction) => transaction.objectStore<Workspace>("workspaces").get$(id)),
        ),
    );
}

export function getWorkspaces() {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readonly")),
            concatMap((transaction) => transaction.objectStore<Workspace>("workspaces").getAll$()),
        ),
    );
}

export function addWorkspace(workspace: Workspace) {
    return lastValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readwrite")),
            concatMap((transaction) => transaction.objectStore<Workspace>("workspaces").add$(workspace, workspace.id)),
        ),
    );
}
