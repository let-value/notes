import { atom, selector } from "recoil";
import { Workspace, WorkspaceId } from "models";
import { backend } from "messaging";
import { createQueryEffect } from "../createQueryEffect";

export const workspacesSelector = atom<Workspace[]>({
    key: "workspaces",
    default: selector({
        key: "workspaces/initial",
        get: async () => {
            return await backend.workspaces.call(undefined);
        },
    }),
    effects: [createQueryEffect(backend.workspaces)],
});

export const workspaceLookupSelector = selector<Map<WorkspaceId, Workspace>>({
    key: "workspacesLookup",
    get: async ({ get }) => {
        const workspaces = get(workspacesSelector);
        return new Map(workspaces.map((workspace) => [workspace.id, workspace]));
    },
});
