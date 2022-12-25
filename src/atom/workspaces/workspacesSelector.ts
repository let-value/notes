import { selector } from "recoil";
import { db } from "../../db";
import { Workspace, WorkspaceId } from "../../domain/DirectoryHandle";

export const workspacesSelector = selector<Workspace[]>({
    key: "workspaces",
    get: async () => {
        return await db.getAll("workspaces");
    },
});

export const workspaceLookupSelector = selector<Map<WorkspaceId, Workspace>>({
    key: "workspacesLookup",
    get: async ({ get }) => {
        const workspaces = get(workspacesSelector);
        return new Map(workspaces.map((workspace) => [workspace.id, workspace]));
    },
});
