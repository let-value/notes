import { TreeNode } from "./TreeNode";
import { TreeDirectoryNode } from "./Workspace/Directory";
import { TreeWorkspaceNode } from "./Workspace/Workspace";

export class TreeNodeExtensions {
    static async findNested(root: TreeNode, path: string) {
        const queue: TreeNode[] = [root];

        while (queue.length > 0) {
            const node = queue.shift();

            if (node instanceof TreeWorkspaceNode && node.constructor === TreeWorkspaceNode) {
                await node.mounted;
                for (const child of node.nested.values()) {
                    queue.push(await child.lastValue);
                }
                continue;
            }

            if (
                node instanceof TreeDirectoryNode &&
                node.constructor === TreeDirectoryNode &&
                path.includes(node.item.path)
            ) {
                await node.mounted;
                for (const child of node.nested.values()) {
                    queue.push(await child.lastValue);
                }
            }

            if (node.item.path === path) {
                return node;
            }
        }

        return undefined;
    }

    static register(ctx: TreeNode, item: TreeNode) {
        if (!ctx) {
            return;
        }

        ctx.nested.setValue(item.item.path, item);
    }

    static unregister(ctx: TreeNode, item: TreeNode) {
        if (!ctx) {
            return;
        }

        ctx.nested.setValue(item.item.path, undefined);
    }
}
