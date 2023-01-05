import { container } from "@/container";
import { backend, ReadFileQuery } from "messaging";
import { Item } from "models";
import { atom, atomFamily, selectorFamily } from "recoil";

const dispatcher = container.get("dispatcher");

export const fileState = atom<Item | undefined>({
    key: "file",
    default: undefined,
});

export const fileContentState = atomFamily({
    key: "file/content",
    default: selectorFamily({
        key: "file/content/initial",
        get: (query: Readonly<Partial<ReadFileQuery>>) => async () => {
            if (!query.workspaceId || !query.path) {
                return undefined;
            }

            try {
                return await dispatcher.call(backend.workspace.file.content, query as ReadFileQuery);
            } catch {
                return undefined;
            }
        },
    }),
});

export const fileTokensState = atomFamily({
    key: "file/tokens",
    default: selectorFamily({
        key: "file/tokens/initial",
        get: (query: Readonly<Partial<ReadFileQuery>>) => async () => {
            if (!query.workspaceId || !query.path) {
                return undefined;
            }

            try {
                return await dispatcher.call(backend.workspace.file.tokens, query as ReadFileQuery);
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
    }),
});
