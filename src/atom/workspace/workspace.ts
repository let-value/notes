import { Workspace, WorkspaceId } from "@/domain";
import { backend, frontend } from "@/messaging";
import { atom, atomFamily, selectorFamily } from "recoil";
import { createCommandEffect } from "../createQueryEffect";

export const workspaceState = atom<Workspace | undefined>({
    key: "workspace",
    default: undefined,
});

export const directoriesState = atomFamily({
    key: "directories",
    default: selectorFamily({
        key: "directories/initial",
        get: (workspaceId: WorkspaceId) => async () => {
            return await backend.workspace.treeItems.call(workspaceId);
        },
    }),
    effects: (workspaceId: WorkspaceId) => [
        createCommandEffect(frontend.workspace.updateTreeItems, (x) => x.meta === workspaceId),
    ],
});
