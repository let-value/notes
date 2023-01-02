import { customMonarchMarkdownLanguage } from "app/src/components/Document/customMonarchMarkdownLanguage";
import { filesToTree } from "app/src/utils/itemsToTree";
import { filename } from "language-detect";
import map from "language-map";
import { TreeItem } from "models";
import { editor, languages } from "monaco-editor/esm/vs/editor/editor.api";
import { queue } from "queue";
import { WorkspaceStore } from "./WorkspaceStore";

languages.setMonarchTokensProvider("markdown", customMonarchMarkdownLanguage);

export class WorkspaceParseHelper {
    constructor(private store: WorkspaceStore) {}
    async start() {
        const files = await this.store.fs.getItems();
        const { root, lookup } = filesToTree(this.store.workspace.id, files);
        this.parseItem(root);
    }
    async parseItem(tree: TreeItem | undefined) {
        if (!tree) {
            return;
        }

        if (tree.isDirectory) {
            for (const child of tree.children ?? []) {
                this.parseItem(child);
            }
            return;
        }

        const fileContent = await this.store.fs.readFile(tree.path);

        const taskId = `${this.store.workspace.id}/parse/${tree.path}`;
        queue.add(
            () => {
                const detected: any = filename(tree.name);
                const language = (map as any)[detected]?.aceMode;
                const tokens = editor.tokenize(fileContent, language);
                console.log(tree.name, language, tokens);
            },
            { priority: 1, type: taskId },
        );
    }
}
