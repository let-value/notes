import { container } from "@/container";
import { backend, ReadFileQuery } from "messaging";
import { Item, WorkspaceId } from "models";
import { noWait, selectorFamily } from "recoil";

const dispatcher = container.get("dispatcher");

export const workspaceItems = selectorFamily({
    key: "workspace/items",
    get: (query: Readonly<ReadFileQuery>) => () => {
        return dispatcher.call(backend.workspace.items, query);
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
            const rootItems = await get(
                noWait(workspaceItems({ workspaceId: query.workspaceId, path: "/" })),
            ).toPromise();

            const queue: ListItem[] = rootItems.map((x) => ({ ...x, depth: 0 }));

            const result: ListItem[] = [];

            while (queue.length) {
                const item = queue.shift();
                if (!item) {
                    break;
                }

                if (item?.isDirectory && query.expanded.includes(item.path)) {
                    const items = await get(
                        noWait(workspaceItems({ workspaceId: query.workspaceId, path: item.path })),
                    ).toPromise();
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
