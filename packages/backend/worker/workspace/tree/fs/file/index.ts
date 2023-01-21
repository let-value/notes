import { TreeNode } from "../../TreeNode";
import { CsvNode } from "./Csv/CsvNode";
import { MarkdownNode } from "./Markdown/MarkdownNode";

export * from "./FileComponentProps";

export const fileComponent: Record<string, typeof TreeNode> = {
    markdown: MarkdownNode,
    csv: CsvNode,
};
