import { Item, TreeItem, WorkspaceId } from "@/domain";
import path from "path";

export function filesToTree(workspaceId: WorkspaceId, files: Item[]) {
    const lookup = new Map<string, TreeItem>();

    const root: TreeItem = {
        name: workspaceId,
        path: "/",
        isDirectory: true,
        children: [],
    };

    lookup.set(root.path, root);

    const queue = [...files];

    while (queue.length > 0) {
        const item = queue.shift();

        if (!item) {
            continue;
        }

        const parentNode = lookup.get(path.dirname(item.path));
        if (!parentNode) {
            queue.push(item);
            continue;
        }

        const node: TreeItem = {
            ...item,
        };

        if (node.isDirectory) {
            node.children = [];
        }

        lookup.set(item.path, node);
        parentNode.children?.push(node);
    }

    return { lookup, root: lookup.get(root.path) };
}
