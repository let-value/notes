import { createDocument } from "@ampproject/worker-dom/dist/server-lib.mjs";

import ReactDOM from "react-dom/client";
import { container } from "../container";
import { ErrorBoundary } from "./ErrorBoundary";
import { WorkspaceNode } from "./tree/WorkspaceNode";
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
                <WorkspaceNode store={store} />
            </ErrorBoundary>,
        );
    }

    dispose() {
        this.root.unmount();
        this.container.remove();
    }
}
