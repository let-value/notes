import { getLanguage } from "@/utils/getLanguage";
import { backend, ItemQuery } from "messaging";
import { Item } from "models";
import { atomFamily, selectorFamily } from "recoil";
import { createQueryEffect } from "../../createQueryEffect";
import { context } from "../../storeServices";
import { setRecoil } from "../../tunnel";

export const workspacePathsSelector = atomFamily({
    key: "workspace/items/path",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    default: (workspaceId: ItemQuery["workspaceId"]) => new Set<ItemQuery["path"]>(),
});

export const workspaceItemsSelector = selectorFamily({
    key: "workspace/items/selector",
    get: (query: Readonly<ItemQuery>) => async () => {
        const result = await context.dispatcher.call(backend.workspace.items, query);
        setRecoil(workspacePathsSelector(query.workspaceId), (value) => {
            const result = new Set(value);
            result.add(query.path);
            return result;
        });

        return result;
    },
});

export const workspaceItemsState = atomFamily({
    key: "workspace/items",
    default: workspaceItemsSelector,
    effects: (query: Readonly<ItemQuery>) => [
        createQueryEffect(
            backend.workspace.items,
            (response) => response.meta?.path === query.path && response.meta?.workspaceId === query.workspaceId,
        ),
    ],
});

export interface RichItem<TDirectory extends boolean = any> extends Item<TDirectory> {
    language?: string;
}

export const workspaceItemsWithMetaSelector = selectorFamily({
    key: "workspace/itemsWithMeta/selector",
    get:
        (query: Readonly<ItemQuery>) =>
        ({ get }) => {
            const items = get(workspaceItemsState(query));

            const result: RichItem[] = [];

            for (const item of items) {
                if (item.isDirectory) {
                    result.push(item);
                    continue;
                }

                const language = getLanguage(item);

                result.push({
                    ...item,
                    language,
                });
            }

            return result;
        },
});
