import { Item, WorkspaceId } from "models";
import { noWait, selectorFamily } from "recoil";
import { workspaceItemsState } from "./workspaceItemsSelector";
import { workspaceRootSelector } from "./workspaceRootSelector";

export interface WorkspaceTreeReqest {
    workspaceId: WorkspaceId;
    expanded: string[];
}

export interface ListItem<TDirectory extends boolean = any> extends Item<TDirectory> {
    loading?: boolean;
    collapsed?: Item<true>[];
    depth: number;
}

export const workspaceTree = selectorFamily({
    key: "workspace/tree",
    get:
        ({ workspaceId, expanded }: Readonly<WorkspaceTreeReqest>) =>
        async ({ get }) => {
            const rootItem = await get(noWait(workspaceRootSelector(workspaceId))).toPromise();

            const queue: ListItem[] = [{ ...rootItem, depth: -1 }];

            const result: ListItem[] = [];

            while (queue.length) {
                const item = queue.shift();
                if (!item) {
                    break;
                }

                const show = expanded.includes(item.path) || item.depth < 0;

                if (item?.isDirectory && show) {
                    const response = get(noWait(workspaceItemsState({ workspaceId, path: item.path })));
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

                if (item.path === rootItem.path) {
                    continue;
                }

                result.push(item);
            }

            return result;
        },
});
