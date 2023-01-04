import { createDocument } from "@ampproject/worker-dom/dist/server-lib.mjs";
import { parseModelTokens } from "app/src/editor/tokens/parseModelTokens";

import { TreeItem } from "models";
import { editor, Uri } from "monaco-editor/esm/vs/editor/editor.api";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Workspace } from "../components/Workspace/Workspace";
import { container } from "../container";
import { WorkspaceStore } from "./WorkspaceStore";

const queue = container.get("queue");

export class WorkspaceParseHelper {
    document: Document;
    container: HTMLDivElement;
    root: ReactDOM.Root;
    constructor(private store: WorkspaceStore) {
        this.document = createDocument();
        this.container = this.document.createElement("div");
        this.root = ReactDOM.createRoot(this.container);
        this.root.render(
            <ErrorBoundary>
                <Workspace store={store} />
            </ErrorBoundary>,
        );
    }

    dispose() {
        this.root.unmount();
        this.container.remove();
    }

    getFileReference(item: TreeItem): import("react").Ref<unknown> {
        throw new Error("Method not implemented.");
    }

    async getTokens(tree: TreeItem, language: string) {
        if (!tree || tree.isDirectory) {
            return undefined;
        }

        const content = await this.store.fs.readFile(tree.path);
        const taskId = `${this.store.workspace.id}/parse/${tree.path}`;
        return await queue.add(
            () => {
                const model = editor.createModel(content, language, Uri.file(tree.path));
                return parseModelTokens(model);
            },
            { priority: 1, type: taskId },
        );
    }
}
