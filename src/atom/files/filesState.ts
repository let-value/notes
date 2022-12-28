import { TreeItem, WorkspaceId } from "@/domain";
import { backend, frontend } from "@/messaging";
import path from "path";
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

            const lookup = new Map<string, TreeItem>();

            const root: TreeItem = {
                name: workspaceId,
                path: "/",
                isDirectory: true,
                children: [],
            };

            lookup.set(root.path, root);

            const queue = [...files];

            while (queue.length > 0) {
                const item = queue.shift();

                if (!item) {
                    continue;
                }

                const parentNode = lookup.get(path.dirname(item.path));
                if (!parentNode) {
                    queue.push(item);
                    continue;
                }

                const node: TreeItem = {
                    ...item,
                };

                if (node.isDirectory) {
                    node.children = [];
                    lookup.set(item.path, node);
                }

                parentNode.children?.push(node);
            }

            return lookup.get(root.path);
        },
});
