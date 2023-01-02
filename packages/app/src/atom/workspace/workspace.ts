import { container } from "@/container";
import { backend, frontend } from "messaging";
import { Workspace, WorkspaceId } from "models";
import { atom, atomFamily, selectorFamily } from "recoil";
import { createCommandEffect, createQueryEffect } from "../createQueryEffect";

const dispatcher = container.get("dispatcher");

export const workspaceState = atom<Workspace | undefined>({
    key: "workspace",
    default: undefined,
});

export const filesState = atomFamily({
    key: "files",
    default: selectorFamily({
        key: "files/initial",
        get: (workspaceId: WorkspaceId) => async () => {
            return await dispatcher.call(backend.workspace.files, workspaceId);
        },
    }),
    effects: (workspaceId: WorkspaceId) => [
        createCommandEffect(frontend.workspace.files, (x) => x.meta === workspaceId),
        createQueryEffect(backend.workspace.files, (x) => x.meta === workspaceId),
    ],
});
