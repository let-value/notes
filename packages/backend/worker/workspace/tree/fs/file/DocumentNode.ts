import { TreeContextProps, TreeNode } from "../../TreeNode";
import { FileNode } from "../FileNode";

export class DocumentNode<TProps = unknown, TState = unknown> extends TreeNode<TProps, TState> {
    declare context: TreeContextProps<FileNode>;
}
