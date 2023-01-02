import { container } from "@/container";
import { backend } from "messaging";
import { Workspace, WorkspaceId } from "models";
import { atom, selector } from "recoil";
import { createQueryEffect } from "../createQueryEffect";

const dispatcher = container.get("dispatcher");

export const workspacesSelector = atom<Workspace[]>({
    key: "workspaces",
    default: selector({
        key: "workspaces/initial",
        get: async () => {
            return await dispatcher.call(backend.workspaces, undefined);
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
