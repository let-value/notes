import { backend, matchQuery } from "messaging";

import { container } from "../../container";
import { DirectoryNode } from "../../workspace/tree/DirectoryNode";
import { WorkspaceStore } from "../../workspace/WorkspaceStore";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(backend.workspace.root)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload);
        const node = await store.root.lastValue;

        await node.ready;
        const item = node.root.value;

        await dispatcher.send(backend.workspace.root.response(item, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.root.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.items)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);
        await store.root.lastValue;

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof DirectoryNode)) {
            throw new Error("Not a directory");
        }

        const items = await node.items.update();

        await dispatcher.send(backend.workspace.items.response(items, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.items.error(error, query));
    }
});
