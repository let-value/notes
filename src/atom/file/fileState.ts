import { Item } from "@/domain";
import { backend, ReadFileQuery } from "@/messaging";
import { atom, atomFamily, selectorFamily } from "recoil";

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
                return await backend.workspace.readFile.call(query as ReadFileQuery);
            } catch {
                return undefined;
            }
        },
    }),
});
