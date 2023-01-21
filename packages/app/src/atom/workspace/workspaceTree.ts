import { orderBy } from "lodash-es";
import { Item, WorkspaceId } from "models";
import { noWait, selectorFamily } from "recoil";
import { ListItem } from "./items/ListItem";
import { newItemState } from "./items/newItemState";
import { workspaceItemsState } from "./items/workspaceItemsSelector";
import { workspaceRootSelector } from "./workspaceRootSelector";

export interface WorkspaceTreeReqest {
    workspaceId: WorkspaceId;
    expanded: Set<string>;
}

export const workspaceTree = selectorFamily({
    key: "workspace/tree",
    get:
        ({ workspaceId, expanded }: Readonly<WorkspaceTreeReqest>) =>
        async ({ get }) => {
            const rootItem = await get(noWait(workspaceRootSelector(workspaceId))).toPromise();
            const newItem = get(newItemState);

            const queue: ListItem[] = [{ ...rootItem, depth: -1 }];

            const result: ListItem[] = [];

            while (queue.length) {
                const item = queue.shift();
                if (!item) {
                    break;
                }

                const show = expanded.has(item.path) || item.depth < 0;

                if (item?.isDirectory && show && !item.new) {
                    const response = get(noWait(workspaceItemsState({ workspaceId, path: item.path })));
                    item.loading = response.state === "loading";

                    const childs: Item[] = [];

                    const isNewItem = newItem?.path === item.path;
                    if (isNewItem) {
                        childs.push(newItem);
                    }

                    if (response.state === "hasValue") {
                        const items = response.contents;

                        const firstItem = items?.[0];
                        if (!isNewItem && items.length === 1 && firstItem?.isDirectory) {
                            queue.unshift({
                                ...firstItem,
                                collapsed: [...(item.collapsed ?? []), item],
                                depth: item.depth,
                            });
                            continue;
                        }

                        childs.push(...items);
                    }

                    queue.unshift(
                        ...orderBy(childs, ["isDirectory", "new", "name"], ["desc", "asc", "asc"]).map((x) => ({
                            ...x,
                            depth: item.depth + 1,
                        })),
                    );
                }

                if (item.path === rootItem.path && item.depth === -1) {
                    continue;
                }

                result.push(item);
            }

            return result;
        },
});
