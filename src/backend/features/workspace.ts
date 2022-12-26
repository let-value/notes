import { concatMap, firstValueFrom, lastValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { Workspace } from "../../domain";
import { backend, frontend, matchQuery, mediator } from "../../messaging";
import { incrementFileNameIfExist } from "../../utils/incrementFileNameIfExist";
import { database } from "../rdb/database";

mediator.pipe(matchQuery(backend.workspace.openDirectory)).subscribe(async (query) => {
    const handle = await frontend.pickDirectory.call("readwrite", query.senderId);

    const workspaces = await firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readonly")),
            concatMap((transaction) => transaction.objectStore<Workspace>("workspaces").getAll$()),
        ),
    );

    let previousWorkspace: Workspace | undefined = undefined;
    for (const workspace of workspaces) {
        if (await workspace.handle.isSameEntry(handle)) {
            previousWorkspace = workspace;
            break;
        }
    }

    if (previousWorkspace) {
        backend.workspace.openDirectory.respond(query, previousWorkspace);
        return;
    }

    const workspaceNames = workspaces.map((workspace) => workspace.name);
    const id = uuidv4();
    const name = incrementFileNameIfExist(handle.name, workspaceNames);
    const workspace = { id, name, handle };

    try {
        await lastValueFrom(
            database.pipe(
                concatMap((db) => db.transaction$(["workspaces"], "readwrite")),
                concatMap((transaction) => transaction.objectStore<Workspace>("workspaces").add$(workspace, id)),
            ),
        );

        await backend.workspace.openDirectory.respond(query, workspace);
    } catch (error) {
        await backend.workspace.openDirectory.respondError(query, error);
    }
});
