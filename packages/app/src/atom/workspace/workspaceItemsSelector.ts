import { backend, ReadFileQuery } from "messaging";
import { selectorFamily } from "recoil";
import { storeServices } from "../storeServices";

export const workspaceItemsSelector = selectorFamily({
    key: "workspace/items",
    get: (query: Readonly<ReadFileQuery>) => () => {
        return storeServices.dispatcher.call(backend.workspace.items, query);
    },
});
