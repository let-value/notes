import { Workspace } from "models";
import { concatMap, firstValueFrom, lastValueFrom } from "rxjs";
import { database } from "../database";
import { name } from "../stores/workspaces";

export function getWorkspace(id: string) {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readonly")),
            concatMap((transaction) => transaction.objectStore<Workspace>(name).get$(id)),
        ),
    );
}

export function getWorkspaces() {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readonly")),
            concatMap((transaction) => transaction.objectStore<Workspace>(name).getAll$()),
        ),
    );
}

export function addWorkspace(workspace: Workspace) {
    return lastValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readwrite")),
            concatMap((transaction) => transaction.objectStore<Workspace>(name).add$(workspace, workspace.id)),
        ),
    );
}
