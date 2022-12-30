import { WorkspaceHandle, WorkspaceId } from "@/domain";
import { getWorkspace } from "./getWorkspace";
import { WorkspaceFilesHelper } from "./WorkspaceFilesHelper";
import { WorkspaceParseHelper } from "./WorkspaceParseHelper";
import { WorkspacePermissionHelper } from "./WorkspacePermissionHelper";

const workspaceStores = new Map<WorkspaceId, WorkspaceStore>();

export class WorkspaceStore {
    permission: WorkspacePermissionHelper;
    fs: WorkspaceFilesHelper;
    parse: WorkspaceParseHelper;
    constructor(public workspace: WorkspaceHandle) {
        this.permission = new WorkspacePermissionHelper(this);
        this.fs = new WorkspaceFilesHelper(this);
        this.parse = new WorkspaceParseHelper(this);

        this.parse.start();
    }

    static async getInstance(id: WorkspaceId) {
        let workspaceStore = workspaceStores.get(id);
        if (!workspaceStore) {
            const workspace = await getWorkspace(id);
            if (!workspace) {
                throw new Error("Workspace not found");
            }
            workspaceStore = new WorkspaceStore(workspace);
            workspaceStores.set(id, workspaceStore);
        }
        return workspaceStore;
    }
}
