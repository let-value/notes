import { backend, ReadFileQuery } from "messaging";
import { atomFamily, selectorFamily } from "recoil";
import { createQueryEffect } from "../createQueryEffect";
import { context } from "../storeServices";
import { setRecoil } from "../tunnel";

export const workspacePathsSelector = atomFamily({
    key: "workspace/items/path",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    default: (workspaceId: ReadFileQuery["workspaceId"]) => new Set<ReadFileQuery["path"]>(),
});

export const workspaceItemsSelector = selectorFamily({
    key: "workspace/items/selector",
    get: (query: Readonly<ReadFileQuery>) => () => {
        return context.dispatcher.call(backend.workspace.items, query);
    },
});

export const workspaceItemsState = atomFamily({
    key: "workspace/items",
    default: workspaceItemsSelector,
    effects: (query: Readonly<ReadFileQuery>) => [
        createQueryEffect(
            backend.workspace.items,
            (response) => response.meta?.path === query.path && response.meta?.workspaceId === query.workspaceId,
        ),
        ({ trigger }) => {
            if (trigger !== "get") {
                return;
            }

            setRecoil(workspacePathsSelector(query.workspaceId), (value) => {
                const result = new Set(value);
                result.add(query.path);
                return result;
            });
        },
    ],
});
