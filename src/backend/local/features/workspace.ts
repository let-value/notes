import { Item, Workspace, WorkspaceHandle } from "@/domain";
import { backend, dispatch, frontend, matchQuery, mediator } from "@/messaging";
import { incrementFileNameIfExist } from "@/utils";
import path from "path";
import { concatMap, firstValueFrom, lastValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { database } from "../db/database";

function getWorkspace(id: string) {
    return firstValueFrom(
        database.pipe(
            concatMap((db) => db.transaction$(["workspaces"], "readonly")),
            concatMap((transaction) => transaction.objectStore<WorkspaceHandle>("workspaces").get$(id)),
        ),
    );
}

mediator.pipe(matchQuery(backend.workspace.openDirectory)).subscribe(async (query) => {
    const handle = await frontend.pickDirectory.call(undefined, query.senderId);

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
    const workspace = { id, name, handle };

    try {
        await lastValueFrom(
            database.pipe(
                concatMap((db) => db.transaction$(["workspaces"], "readwrite")),
                concatMap((transaction) => transaction.objectStore<Workspace>("workspaces").add$(workspace, id)),
            ),
        );

        dispatch.next(backend.workspaces.selfQuery(undefined));
        await backend.workspace.openDirectory.respond(query, workspace);
    } catch (error) {
        await backend.workspace.openDirectory.respondError(query, error);
    }
});

mediator.pipe(matchQuery(backend.workspace.open)).subscribe(async (query) => {
    try {
        const workspace = await getWorkspace(query.payload);

        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const permission = await workspace.handle.queryPermission({ mode: "readwrite" });
        if (permission === "denied") {
            throw new Error("Permission denied");
        }

        if (permission === "prompt") {
            const newPermission = await frontend.requestPermission.call(workspace.handle, query.senderId);

            if (newPermission !== "granted") {
                throw new Error("Permission denied");
            }
        }

        await backend.workspace.open.respond(query, workspace);
    } catch (error) {
        await backend.workspace.open.respondError(query, error);
    }
});

self.process = { cwd: () => "" } as never;
const getItemsRecursively = async function* (
    entry: FileSystemHandle,
    parentPath: string,
): AsyncGenerator<[FileSystemHandle, string]> {
    const newPath = path.resolve(parentPath, entry.name);

    if (entry.kind === "directory") {
        yield [entry, newPath];

        for await (const handle of (entry as FileSystemDirectoryHandle).values()) {
            yield* getItemsRecursively(handle, newPath);
        }
    } else {
        yield [entry, newPath];
    }
};

mediator.pipe(matchQuery(backend.workspace.treeItems)).subscribe(async (query) => {
    try {
        const workspace = await getWorkspace(query.payload);

        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const items: Item[] = [];
        for await (const [handle, parentPath] of getItemsRecursively(workspace.handle, "/")) {
            items.push({ name: handle.name, path: parentPath, isDirectory: handle.kind === "directory" });
        }

        await backend.workspace.treeItems.respond(query, items);
    } catch (error) {
        await backend.workspace.treeItems.respondError(query, error);
    }
});
