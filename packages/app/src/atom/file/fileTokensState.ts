import { backend, ItemQuery } from "messaging";
import { atomFamily, selectorFamily } from "recoil";
import { context } from "../storeServices";

export const fileTokensState = atomFamily({
    key: "file/tokens",
    default: selectorFamily({
        key: "file/tokens/initial",
        get: (query: Readonly<Partial<ItemQuery>>) => async () => {
            if (!query.workspaceId || !query.path) {
                return undefined;
            }

            try {
                return await context.dispatcher.call(backend.workspace.file.tokens, query as ItemQuery);
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
    }),
});
