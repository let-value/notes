import { incrementFileNameIfExist } from "@/utils";
import { BroadcastMessage, frontend } from "messaging";
import { Workspace, WorkspaceHandle, WorkspaceId } from "models";
import { v4 as uuidv4 } from "uuid";
import { addWorkspace, getWorkspace, getWorkspaces } from "../db/repositories";
import { WorkspaceItemsHelper } from "./WorkspaceItemsHelper";
import { WorkspaceParseHelper } from "./WorkspaceParseHelper";
import { WorkspacePermissionHelper } from "./WorkspacePermissionHelper";

const workspaceStores = new Map<WorkspaceId, WorkspaceStore>();

export class WorkspaceStore {
    permission: WorkspacePermissionHelper;
    fs: WorkspaceItemsHelper;
    parse: WorkspaceParseHelper;

    constructor(public workspace: WorkspaceHandle) {
        this.permission = new WorkspacePermissionHelper(this);
        this.fs = new WorkspaceItemsHelper(this);
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

    static async createWorkspace(query: BroadcastMessage) {
        const handle = await frontend.pickDirectory.call(undefined, undefined, query.senderId);

        const workspaces = await getWorkspaces();

        let previousWorkspace: Workspace | undefined = undefined;
        for (const workspace of workspaces) {
            if (await workspace.handle.isSameEntry(handle)) {
                previousWorkspace = workspace;
                break;
            }
        }

        if (previousWorkspace) {
            return WorkspaceStore.getInstance(previousWorkspace.id);
        }

        const workspaceNames = workspaces.map((workspace) => workspace.name);
        const id = uuidv4();
        const name = incrementFileNameIfExist(handle.name, workspaceNames);

        await addWorkspace({ id, name, handle });
        return await WorkspaceStore.getInstance(id);
    }
}
