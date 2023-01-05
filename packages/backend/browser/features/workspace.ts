import { filterByPromise } from "filter-async-rxjs-pipe";
import { backend, matchQuery } from "messaging";
import { ItemHandle } from "models";
import { filter, firstValueFrom, map, mergeMap } from "rxjs";
import { getTokensNodePath, TreeTokensNode } from "../components/Document/WithTokens";
import { TreeDirectoryNode } from "../components/Workspace/Directory";
import { TreeFileNode } from "../components/Workspace/File";
import { container } from "../container";
import { ReactiveValue } from "../utils/ReactiveValue";
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

mediator.pipe(matchQuery(backend.workspace.file.content)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await store.findNodeByPath(query.payload.path);
        if (!(node instanceof TreeFileNode)) {
            throw new Error("Not a file");
        }
        const text = await store.fs.readFile(node.item as ItemHandle);
        await dispatcher.send(backend.workspace.file.content.response(text, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.file.content.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.file.tokens)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const fileNode = await store.findNodeByPath(query.payload.path);
        if (!(fileNode instanceof TreeFileNode)) {
            throw new Error("Not a file");
        }

        const tokensPath = getTokensNodePath(fileNode.item);

        const tokensNode = await firstValueFrom(
            fileNode.nested.observable.pipe(
                map((x) => x.get(tokensPath)),
                filter(Boolean),
                mergeMap((x: ReactiveValue<TreeTokensNode>) => x.valuePipe),
                filterByPromise((x) => x.ready),
            ),
        );

        const tokens = await tokensNode.tokens.lastValue;

        await dispatcher.send(backend.workspace.file.tokens.response(tokens, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.file.tokens.error(error, query));
    }
});

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
