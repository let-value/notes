import { concatMap, firstValueFrom, lastValueFrom } from "rxjs";
import { database } from "../database";
import { GDriveWorkspace, name } from "../stores/gdriveWorkspaces";

export function getGDriveWorkspace(id: string) {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readonly")),
            concatMap((transaction) => transaction.objectStore<GDriveWorkspace>(name).get$(id)),
        ),
    );
}

export function getGDriveWorkspaces() {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readonly")),
            concatMap((transaction) => transaction.objectStore<GDriveWorkspace>(name).getAll$()),
        ),
    );
}

export function addGDriveWorkspace(workspace: GDriveWorkspace) {
    return lastValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readwrite")),
            concatMap((transaction) => transaction.objectStore<GDriveWorkspace>(name).add$(workspace, workspace.id)),
        ),
    );
}

export function updateGDriveWorkspace(workspace: GDriveWorkspace) {
    return lastValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$([name], "readwrite")),
            concatMap((transaction) => transaction.objectStore<GDriveWorkspace>(name).put$(workspace, workspace.id)),
        ),
    );
}
