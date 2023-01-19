import { TreeNode } from "../TreeNode";
import { MarkdownNode } from "./Markdown/MarkdownNode";

export * from "./FileComponentProps";

export const fileComponent: Record<string, typeof TreeNode> = {
    markdown: MarkdownNode,
};
