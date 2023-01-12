import { createDocument } from "@ampproject/worker-dom/dist/server-lib.mjs";
import { parseModelTokens } from "app/src/editor/tokens/parseModelTokens";

import { Item } from "models";
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

    async getTokens(item: Item<false>, language: string) {
        if (!item || item.isDirectory) {
            return undefined;
        }

        const content = await this.store.fs.readFile(item);
        const taskId = `${this.store.workspace.id}/parse/${item.path}`;
        return await queue.add(
            () => {
                const model = editor.createModel(content, language, Uri.file(item.path));
                return parseModelTokens(model);
            },
            { priority: 1, type: taskId },
        );
    }
}
