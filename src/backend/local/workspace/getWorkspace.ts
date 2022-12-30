import { WorkspaceHandle } from "@/domain";
import { concatMap, firstValueFrom } from "rxjs";
import { database } from "../db/database";

export function getWorkspace(id: string) {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readonly")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>("workspaces").get$(id)),
        ),
    );
}
