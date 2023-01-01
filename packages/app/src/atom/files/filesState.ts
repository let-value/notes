import { WorkspaceId } from "@/domain";
import { backend, frontend } from "@/messaging";
import { filesToTree } from "@/utils/itemsToTree";
import { atomFamily, selectorFamily } from "recoil";
import { createCommandEffect, createQueryEffect } from "../createQueryEffect";

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

export const filesTree = selectorFamily({
    key: "filesTree",
    get:
        (workspaceId: WorkspaceId) =>
        async ({ get }) => {
            const files = get(filesState(workspaceId));

            const { root } = filesToTree(workspaceId, files);

            return root;
        },
});
