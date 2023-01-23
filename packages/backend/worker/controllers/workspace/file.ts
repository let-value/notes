import { backend, matchQuery } from "messaging";

import { container } from "../../container";
import { DirectoryNode } from "../../workspace/tree/fs/DirectoryNode";
import { FileNode } from "../../workspace/tree/fs/FileNode";

import { WorkspaceStore } from "../../workspace/WorkspaceStore";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

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

mediator.pipe(matchQuery(backend.workspace.file.create)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof DirectoryNode)) {
            throw new Error("Not a directory");
        }
        await node.ready;
        await node.createFile(query.payload.name);

        await dispatcher.send(backend.workspace.file.create.response(true, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.file.create.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.file.move)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof FileNode)) {
            throw new Error("Not a file");
        }
        await node.ready;
        await node.moveTo(query.payload.targetPath);
        await dispatcher.send(backend.workspace.file.move.response(true, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.file.move.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.file.copy)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof FileNode)) {
            throw new Error("Not a file");
        }
        await node.ready;
        await node.copyTo(query.payload.targetPath);
        await dispatcher.send(backend.workspace.file.move.response(true, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.file.move.error(error, query));
    }
});
