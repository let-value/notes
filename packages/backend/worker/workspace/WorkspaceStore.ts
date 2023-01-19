import { ReactiveValue } from "app/src/utils";
import { Item, Workspace, WorkspaceId } from "models";

import { container } from "../container";
import { getWorkspace } from "../db/repositories/workspaces";
import { FileSystemProvider } from "../fs/FileSystemProvider";
import { FileRegistryNode } from "./tree/FileRegistryNode";
import { WorkspaceNode } from "./tree/WorkspaceNode";
import { TreeNodeExtensions } from "./TreeNodeExtensions";
import { WorkspaceParseHelper } from "./WorkspaceParseHelper";

const fs = container.get("fs");
const workspaceStores = new Map<WorkspaceId, WorkspaceStore>();

export class WorkspaceStore {
    root: ReactiveValue<WorkspaceNode>;
    registry: ReactiveValue<FileRegistryNode>;
    parse: WorkspaceParseHelper;
    fs: FileSystemProvider;

    constructor(public workspace: Workspace) {
        this.root = new ReactiveValue<WorkspaceNode>();
        this.parse = new WorkspaceParseHelper(this);
        this.registry = new ReactiveValue<FileRegistryNode>();
        this.fs = fs;
    }

    async findNodeByPath(path: string) {
        return await TreeNodeExtensions.findNode(await this.root.lastValue, path);
    }

    async findNodeByLink(origin: Item<false>, path: string) {
        return await TreeNodeExtensions.findNode(await this.root.lastValue, path);
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
