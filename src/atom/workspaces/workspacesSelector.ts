import { atom, selector } from "recoil";
import { call } from "../../backend/api";
import { methods } from "../../backend/methods";
import { Workspace, WorkspaceId } from "../../domain/Workspace";
import { createBroadcastEffect } from "../createBroadcastEffect";

export const workspacesSelector = atom<Workspace[]>({
    key: "workspaces",
    default: selector({
        key: "workspaces/initial",
        get: async () => {
            return await call(methods.workspaces, undefined);
        },
    }),
    effects: [createBroadcastEffect(methods.workspaces)],
});

export const workspaceLookupSelector = selector<Map<WorkspaceId, Workspace>>({
    key: "workspacesLookup",
    get: async ({ get }) => {
        const workspaces = get(workspacesSelector);
        return new Map(workspaces.map((workspace) => [workspace.id, workspace]));
    },
});
