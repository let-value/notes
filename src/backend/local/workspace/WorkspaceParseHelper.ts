import { WorkspaceStore } from "./WorkspaceStore";

export class WorkspaceParseHelper {
    constructor(private store: WorkspaceStore) {}
    async start() {
        const files = await this.store.fs.getFiles();
    }
}
