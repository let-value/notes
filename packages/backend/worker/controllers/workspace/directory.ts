import { backend, matchQuery } from "messaging";

import { container } from "../../container";
import { DirectoryNode } from "../../workspace/tree/fs/DirectoryNode";
import { WorkspaceStore } from "../../workspace/WorkspaceStore";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(backend.workspace.directory.create)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof DirectoryNode)) {
            throw new Error("Not a directory");
        }
        await node.ready;
        await node.createDirectory(query.payload.name);

        await dispatcher.send(backend.workspace.file.create.response(true, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.file.create.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.directory.move)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof DirectoryNode)) {
            throw new Error("Not a directory");
        }
        await node.ready;
        await node.moveTo(query.payload.targetPath);
        await dispatcher.send(backend.workspace.directory.move.response(true, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.directory.move.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.file.copy)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof DirectoryNode)) {
            throw new Error("Not a directory");
        }
        await node.ready;
        await node.copyTo(query.payload.targetPath);
        await dispatcher.send(backend.workspace.directory.move.response(true, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.directory.move.error(error, query));
    }
});
