import { backend, ReadFileQuery } from "messaging";
import { selectorFamily } from "recoil";
import { context } from "../storeServices";

export const workspaceItemsSelector = selectorFamily({
    key: "workspace/items",
    get: (query: Readonly<ReadFileQuery>) => () => {
        return context.dispatcher.call(backend.workspace.items, query);
    },
});
