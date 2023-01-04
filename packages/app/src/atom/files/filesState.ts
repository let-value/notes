import { container } from "@/container";
import { filesToTree } from "@/utils/itemsToTree";
import { backend, frontend, ReadFileQuery } from "messaging";
import { Item, WorkspaceId } from "models";
import { atomFamily, selectorFamily } from "recoil";
import { createCommandEffect, createQueryEffect } from "../createQueryEffect";

const dispatcher = container.get("dispatcher");

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

export const workspaceItems = selectorFamily({
    key: "workspace/items",
    get: (query: Readonly<ReadFileQuery>) => async () => {
        console.log("workspace/items", query);
        return await dispatcher.call(backend.workspace.items, query);
    },
});

export interface WorkspaceTreeReqest {
    workspaceId: WorkspaceId;
    expanded: string[];
}

interface ListItem extends Item {
    collapsed?: Item[];
    depth: number;
}

export const workspaceTree = selectorFamily({
    key: "workspace/tree",
    get:
        (query: Readonly<WorkspaceTreeReqest>) =>
        async ({ get }) => {
            console.log(query);
            const rootItems = get(workspaceItems({ workspaceId: query.workspaceId, path: "/" }));

            const queue: ListItem[] = rootItems.map((x) => ({ ...x, depth: 0 }));

            const result: ListItem[] = [];

            while (queue.length) {
                const item = queue.shift();
                if (!item) {
                    break;
                }

                if (item?.isDirectory && query.expanded.includes(item.path)) {
                    const items = get(workspaceItems({ workspaceId: query.workspaceId, path: item.path }));
                    const firstItem = items?.[0];
                    if (items.length === 1 && firstItem?.isDirectory) {
                        queue.unshift({
                            ...firstItem,
                            collapsed: [...(item.collapsed ?? []), item],
                            depth: item.depth,
                        });
                        continue;
                    }
                    queue.unshift(...items.map((x) => ({ ...x, depth: item.depth + 1 })));
                }

                result.push(item);
            }

            return result;
        },
});
