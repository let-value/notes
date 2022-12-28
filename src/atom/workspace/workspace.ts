import { Workspace, WorkspaceId } from "@/domain";
import { backend, frontend } from "@/messaging";
import { atom, atomFamily, selectorFamily } from "recoil";
import { createCommandEffect, createQueryEffect } from "../createQueryEffect";

export const workspaceState = atom<Workspace | undefined>({
    key: "workspace",
    default: undefined,
});

export const filesState = atomFamily({
    key: "files",
    default: selectorFamily({
        key: "files/initial",
        get: (workspaceId: WorkspaceId) => async () => {
            return await backend.workspace.files.call(workspaceId);
        },
    }),
    effects: (workspaceId: WorkspaceId) => [
        createCommandEffect(frontend.workspace.files, (x) => x.meta === workspaceId),
        createQueryEffect(backend.workspace.files, (x) => x.meta === workspaceId),
    ],
});
