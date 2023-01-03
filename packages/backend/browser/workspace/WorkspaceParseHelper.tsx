import { createDocument } from "@ampproject/worker-dom/dist/server-lib.mjs";
import { getModelTokens } from "app/src/components/Document/useDocumentTokens";
import { markdown } from "app/src/editor/language/markdown";
import { filename } from "language-detect";
import map from "language-map";
import { TreeItem } from "models";
import { editor, languages, Uri } from "monaco-editor/esm/vs/editor/editor.api";
import ReactDOM from "react-dom/client";
import { Workspace } from "../components/Workspace/Workspace";
import { container } from "../container";
import { WorkspaceStore } from "./WorkspaceStore";

languages.setMonarchTokensProvider("markdown", markdown);

const queue = container.get("queue");

export class WorkspaceParseHelper {
    document: Document;
    container: HTMLDivElement;
    root: ReactDOM.Root;
    constructor(private store: WorkspaceStore) {
        this.document = createDocument();
        this.container = this.document.createElement("div");
        this.root = ReactDOM.createRoot(this.container);
        this.root.render(<Workspace store={store} />);
    }

    dispose() {
        this.root.unmount();
        this.container.remove();
    }

    getLanguage(tree: TreeItem): string {
        if (!tree || tree.isDirectory) {
            return undefined;
        }

        const detected: any = filename(tree.name);
        return (map as any)[detected]?.aceMode;
    }

    async getTokens(tree: TreeItem) {
        if (!tree || tree.isDirectory) {
            return undefined;
        }

        const language = this.getLanguage(tree);

        const fileContent = await this.store.fs.readFile(tree.path);
        const taskId = `${this.store.workspace.id}/parse/${tree.path}`;
        return await queue.add(
            () => {
                const model = editor.createModel(fileContent, language, Uri.file(tree.path));
                return getModelTokens(model);
            },
            { priority: 1, type: taskId },
        );
    }
}
