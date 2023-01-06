import { backend, ReadFileQuery } from "messaging";
import { atomFamily, selectorFamily } from "recoil";
import { storeServices } from "../storeServices";

export const fileTokensState = atomFamily({
    key: "file/tokens",
    default: selectorFamily({
        key: "file/tokens/initial",
        get: (query: Readonly<Partial<ReadFileQuery>>) => async () => {
            if (!query.workspaceId || !query.path) {
                return undefined;
            }

            try {
                return await storeServices.dispatcher.call(backend.workspace.file.tokens, query as ReadFileQuery);
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
    }),
});
