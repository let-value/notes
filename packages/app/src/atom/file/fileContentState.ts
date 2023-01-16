import { backend, ReadFileQuery } from "messaging";
import { atomFamily, selectorFamily } from "recoil";

import { context } from "../storeServices";

export const fileContentState = atomFamily({
    key: "file/content",
    default: selectorFamily({
        key: "file/content/initial",
        get: (query: Readonly<Partial<ReadFileQuery>>) => async () => {
            if (!query.workspaceId || !query.path) {
                return undefined;
            }

            try {
                return await context.dispatcher.call(backend.workspace.file.content, query as ReadFileQuery);
            } catch {
                return undefined;
            }
        },
    }),
});
