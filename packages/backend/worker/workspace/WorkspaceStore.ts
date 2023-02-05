import { ReactiveValue } from "app/src/utils";
import { Item, Workspace, WorkspaceId } from "models";

import { container } from "../container";
import { getWorkspace } from "../db/repositories/workspaces";
import { FileSystemProvider } from "../fs/FileSystemProvider";
import { WorkspaceNode } from "./tree/WorkspaceNode";
import { TreeNodeExtensions } from "./TreeNodeExtensions";
import { WorkspaceParseHelper } from "./WorkspaceParseHelper";

const queue = container.get("queue");
const fileSystems = container.get("fileSystems");
const workspaceStores = new Map<WorkspaceId, WorkspaceStore>();

export class WorkspaceStore {
    root: ReactiveValue<WorkspaceNode>;
    parse: WorkspaceParseHelper;
    constructor(public workspace: Workspace, public fs: FileSystemProvider) {
        this.root = new ReactiveValue<WorkspaceNode>();
        this.parse = new WorkspaceParseHelper(this);
    }

    async findNodeByPath(path: string) {
        return await TreeNodeExtensions.findNodeByPath(await this.root.lastValue, path);
    }

    async findNodeByLink(origin: Item<false>, path: string) {
        return await TreeNodeExtensions.findNodeByPath(await this.root.lastValue, path);
    }

    static async getInstance(id: WorkspaceId) {
        return queue.add(
            async () => {
                let workspaceStore = workspaceStores.get(id);
                if (!workspaceStore) {
                    const workspace = await getWorkspace(id);
                    if (!workspace) {
                        throw new Error("Workspace not found");
                    }
                    const fs = await fileSystems.get(workspace.provider, workspace);
                    workspaceStore = new WorkspaceStore(workspace, fs);
                    workspaceStores.set(id, workspaceStore);
                }
                return workspaceStore;
            },
            { priority: 5, type: `getWorkspace${id}` },
        );
    }
}
