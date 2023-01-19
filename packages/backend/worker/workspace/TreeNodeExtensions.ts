import { DirectoryNode } from "./tree/DirectoryNode";
import { FileNode } from "./tree/FileNode";
import { TreeNode } from "./tree/TreeNode";
import { WorkspaceNode } from "./tree/WorkspaceNode";

export class TreeNodeExtensions {
    static async findNode(root: TreeNode, path: string) {
        const queue: TreeNode[] = [root];
        while (queue.length > 0) {
            const node = queue.shift();
            if (node instanceof WorkspaceNode && node.constructor === WorkspaceNode) {
                await node.ready;
                for (const child of node.children.value.values()) {
                    queue.push(child);
                }
                continue;
            }

            if (
                node instanceof DirectoryNode &&
                node.constructor === DirectoryNode &&
                path.includes(node.props.item.path)
            ) {
                await node.ready;

                if (node.props.item.path === path) {
                    return node;
                }

                for (const child of node.children.value.values()) {
                    queue.push(child);
                }
            }

            if (node instanceof FileNode && node.constructor === FileNode && path.includes(node.props.item.path)) {
                await node.ready;
                return node;
            }
        }
        return undefined;
    }
}
