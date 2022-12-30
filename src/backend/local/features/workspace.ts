import { Workspace, WorkspaceHandle } from "@/domain";
import { backend, dispatch, frontend, matchQuery, mediator } from "@/messaging";
import { incrementFileNameIfExist } from "@/utils";
import { concatMap, firstValueFrom, lastValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { database } from "../db/database";
import { WorkspaceStore } from "../workspace/WorkspaceStore";

mediator.pipe(matchQuery(backend.workspace.openDirectory)).subscribe(async (query) => {
    const handle = await frontend.pickDirectory.call(undefined, undefined, query.senderId);

    const workspaces = await firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readonly")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>("workspaces").getAll$()),
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

    try {
        await lastValueFrom(
            database.pipe(
                concatMap((db) => db.transaction$(["workspaces"], "readwrite")),
                concatMap((transaction) =>
                    transaction.objectStore<WorkspaceHandle>("workspaces").add$({ id, name, handle }, id),
                ),
            ),
        );

        dispatch.next(backend.workspaces.selfQuery(undefined));

        const store = await WorkspaceStore.getInstance(id);
        await backend.workspace.openDirectory.respond(query, store.workspace);
    } catch (error) {
        await backend.workspace.openDirectory.respondError(query, error);
    }
});

mediator.pipe(matchQuery(backend.workspace.open)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload);

        await backend.workspace.open.respond(query, store.workspace);
    } catch (error) {
        await backend.workspace.open.respondError(query, error);
    }
});

mediator.pipe(matchQuery(backend.workspace.files)).subscribe(async (query) => {
    try {
        const workspace = await WorkspaceStore.getInstance(query.payload);

        const items = await workspace.fs.getFiles(query);

        await backend.workspace.files.respond(query, items, query.payload);
    } catch (error) {
        await backend.workspace.files.respondError(query, error);
    }
});

mediator.pipe(matchQuery(backend.workspace.readFile)).subscribe(async (query) => {
    try {
        const workspace = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const text = await workspace.fs.readFile(query.payload.path, query);

        await backend.workspace.readFile.respond(query, text);
    } catch (error) {
        await backend.workspace.readFile.respondError(query, error);
    }
});
