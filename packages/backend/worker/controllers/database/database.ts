import { backend, BroadcastMessage, ItemQuery, matchQuery } from "messaging";
import { firstValueFrom } from "rxjs";

import { container } from "../../container";
import { CsvNode } from "../../workspace/tree/fs/file/Csv/CsvNode";
import { SheetNode } from "../../workspace/tree/fs/file/Csv/SheetNode";
import { FileNode } from "../../workspace/tree/fs/FileNode";
import { TreeNodeExtensions } from "../../workspace/TreeNodeExtensions";

import { WorkspaceStore } from "../../workspace/WorkspaceStore";

const mediator = container.get("mediator");
const dispatcher = container.get("dispatcher");

mediator.pipe(matchQuery(backend.workspace.database.meta)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const node = await getSheetNode(store, query);
        const meta = await firstValueFrom(node.metaPipe$);
        await dispatcher.send(backend.workspace.database.meta.response(meta, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.database.meta.error(error, query));
    }
});

mediator.pipe(matchQuery(backend.workspace.database.view)).subscribe(async (query) => {
    try {
        const store = await WorkspaceStore.getInstance(query.payload.workspaceId);

        const sheetNode = await getSheetNode(store, query);

        const node = sheetNode.children$.getValue().find((child) => child.props.view.name === query.payload.view);

        const data = await firstValueFrom(node.data$);

        await dispatcher.send(backend.workspace.database.view.response(data, query));
    } catch (error) {
        await dispatcher.send(backend.workspace.database.view.error(error, query));
    }
});

async function getSheetNode(store: WorkspaceStore, query: BroadcastMessage<"query", ItemQuery, unknown>) {
    const fileNode = await store.findNodeByPath(query.payload.path);
    if (!(fileNode instanceof FileNode)) {
        throw new Error("Not a file");
    }
    await fileNode.ready;

    const csvNode = await TreeNodeExtensions.findNodeByType(fileNode, CsvNode);
    await csvNode.sheetReady;

    const node = await TreeNodeExtensions.findNodeByType(fileNode, SheetNode);
    await node.ready;
    return node;
}
