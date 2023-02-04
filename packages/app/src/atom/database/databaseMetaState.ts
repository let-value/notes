import { backend, ItemQuery } from "messaging";
import { atomFamily, selectorFamily } from "recoil";

import { context } from "../storeServices";

export const databaseMetaState = atomFamily({
    key: "database/meta",
    default: selectorFamily({
        key: "database/meta/initial",
        get: (query: Readonly<Partial<ItemQuery>>) => async () => {
            if (!query.workspaceId || !query.path) {
                return undefined;
            }

            try {
                return await context.dispatcher.call(backend.workspace.database.meta, query as ItemQuery);
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
    }),
});
