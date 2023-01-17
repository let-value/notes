import { backend, matchQuery } from "messaging";
import { Item } from "models";

import { container } from "../container";
import { DirectoryNode } from "../workspace/tree/DirectoryNode";
import { FileNode } from "../workspace/tree/FileNode";
import { WorkspaceStore } from "../workspace/WorkspaceStore";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");
const fs = container.get("fs");

mediator.pipe(matchQuery(backend.workspace.openDirectory)).subscribe(async (query) => {
    try {
        const workspace = await fs.openWorkspace();
        await dispatcher.send(backend.workspace.openDirectory.response(workspace, query));
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

mediator.pipe(matchQuery(backend.workspace.file.content)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof FileNode)) {
            throw new Error("Not a file");
        }
        await node.ready;
        const text = await node.readFile();
        await dispatcher.send(backend.workspace.file.content.response(text, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.file.content.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.file.save)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof FileNode)) {
            throw new Error("Not a file");
        }
        await node.ready;
        await node.writeFile(query.payload.content);
        await dispatcher.send(backend.workspace.file.save.response(true, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.file.save.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.file.tokens)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const fileNode = await store.findNodeByPath(query.payload.path);
        // if (!(fileNode instanceof TreeFileNode)) {
        //     throw new Error("Not a file");
        // }

        //const tokensPath = getTokensNodePath(fileNode.item);

        // const tokensNode = await firstValueFrom(
        //     fileNode.nested.observable.pipe(
        //         map((x) => x.get(tokensPath)),
        //         filter(Boolean),
        //         mergeMap((x: ReactiveValue<TreeTokensNode>) => x.valuePipe),
        //         filterByPromise((x) => x.ready),
        //     ),
        // );

        // const tokens = await tokensNode.tokens.lastValue;

        // await dispatcher.send(backend.workspace.file.tokens.response(tokens, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.file.tokens.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.items)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);
        await store.root.lastValue;
        let items: Item[];

        if (query.payload.path) {
            const node = await store.findNodeByPath(query.payload.path);
            if (!(node instanceof DirectoryNode)) {
                throw new Error("Not a directory");
            }
            await node.ready;
            items = await node.items.value;
        } else {
            const node = await store.root.lastValue;
            await node.ready;
            items = [node.root.value];
        }

        await dispatcher.send(backend.workspace.items.response(items, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.items.error(error, query));
    }
});
