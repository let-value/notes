import { backend, matchQuery } from "messaging";
import { TreeDirectoryNode } from "../components/Workspace/Directory";
import { TreeFileNode } from "../components/Workspace/File";
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

mediator.pipe(matchQuery(backend.workspace.fileContent)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof TreeFileNode)) {
            throw new Error("Not a file");
        }
        const text = await store.fs.readFile(node.item);
        await dispatcher.send(backend.workspace.fileContent.response(text, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.fileContent.error(error, query));
    }
});

// mediator.pipe(matchQuery(backend.workspace.fileTokens)).subscribe(async (query) => {
//     try {
//         const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

//         const tokens = await store.getFile(query.payload.path);

//         await dispatcher.send(backend.workspace.fileTokens.response(tokens, query));
//     } catch (error) {
//         await dispatcher.send(backend.workspace.fileTokens.error(error, query));
//     }
// });

mediator.pipe(matchQuery(backend.workspace.items)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof TreeDirectoryNode)) {
            throw new Error("Not a directory");
        }
        const items = await node.children.lastValue;

        await dispatcher.send(backend.workspace.items.response(items, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.items.error(error, query));
    }
});
