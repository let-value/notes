import { backend, matchQuery, mediator } from "messaging";
import { WorkspaceStore } from "../workspace/WorkspaceStore";

mediator.pipe(matchQuery(backend.workspace.openDirectory)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.createWorkspace(query);
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

        const items = await workspace.fs.getItems(query);

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
