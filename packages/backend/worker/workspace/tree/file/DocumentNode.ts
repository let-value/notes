import { FileNode } from "../FileNode";
import { TreeContextProps, TreeNode } from "../TreeNode";

export class DocumentNode<TProps = unknown, TState = unknown> extends TreeNode<TProps, TState> {
    declare context: TreeContextProps<FileNode>;
}
