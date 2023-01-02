import { backend, matchQuery } from "messaging";
import { container } from "../container";
import { WorkspaceStore } from "../workspace/WorkspaceStore";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(backend.workspace.openDirectory)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.createWorkspace(query);
        await dispatcher.send(backend.workspace.openDirectory.response(store.workspace, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.openDirectory.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.open)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload);
        await dispatcher.send(backend.workspace.open.response(store.workspace, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.open.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.files)).subscribe(async (query) => {
    try {
        const workspace = await WorkspaceStore.getInstance(query.payload);

        const items = await workspace.fs.getItems(query);

        await dispatcher.send(backend.workspace.files.response(items, query, query.payload));
    } catch (error) {
        await dispatcher.send(backend.workspace.files.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.readFile)).subscribe(async (query) => {
    try {
        const workspace = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const text = await workspace.fs.readFile(query.payload.path, query);

        await dispatcher.send(backend.workspace.readFile.response(text, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.readFile.error(error, query));
    }
});
