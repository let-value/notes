import { ReactiveValue } from "app/src/utils";
import { Workspace, WorkspaceId } from "models";
import { TreeNodeExtensions } from "../components/TreeNodeExtensions";
import { TreeWorkspaceNode } from "../components/Workspace/Workspace";
import { container } from "../container";
import { getWorkspace } from "../db/repositories/workspaces";
import { FileSystemProvider } from "../fs/FileSystemProvider";
import { WorkspaceParseHelper } from "./WorkspaceParseHelper";

const fs = container.get("fs");
const workspaceStores = new Map<WorkspaceId, WorkspaceStore>();

export class WorkspaceStore {
    root: ReactiveValue<TreeWorkspaceNode>;
    parse: WorkspaceParseHelper;
    fs: FileSystemProvider;

    constructor(public workspace: Workspace) {
        this.root = new ReactiveValue<TreeWorkspaceNode>();
        this.parse = new WorkspaceParseHelper(this);
        this.fs = fs;
    }

    async findNodeByPath(path: string) {
        return await TreeNodeExtensions.findNested(await this.root.lastValue, path);
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
