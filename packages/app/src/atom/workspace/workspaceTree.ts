import { Item, WorkspaceId } from "models";
import { noWait, selectorFamily } from "recoil";
import { workspaceItemsSelector } from "./workspaceItemsSelector";

export interface WorkspaceTreeReqest {
    workspaceId: WorkspaceId;
    expanded: string[];
}

export interface ListItem extends Item {
    loading?: boolean;
    collapsed?: Item[];
    depth: number;
}

export const workspaceTree = selectorFamily({
    key: "workspace/tree",
    get:
        ({ workspaceId, expanded }: Readonly<WorkspaceTreeReqest>) =>
        async ({ get }) => {
            const rootItems = await get(noWait(workspaceItemsSelector({ workspaceId, path: "" }))).toPromise();

            const queue: ListItem[] = rootItems.map((x) => ({ ...x, depth: 0 }));

            const result: ListItem[] = [];

            while (queue.length) {
                const item = queue.shift();
                if (!item) {
                    break;
                }

                if (item?.isDirectory && expanded.includes(item.path)) {
                    const response = get(noWait(workspaceItemsSelector({ workspaceId, path: item.path })));
                    item.loading = response.state === "loading";

                    if (response.state === "hasValue") {
                        const items = response.contents;

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
                }

                result.push(item);
            }

            return result;
        },
});
