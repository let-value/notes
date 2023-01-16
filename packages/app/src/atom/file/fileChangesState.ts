import { Item } from "models";
import { atomFamily, selectorFamily, useRecoilCallback } from "recoil";

export interface FileChangesState {
    content?: string;
    version?: unknown;
    savedVersion?: unknown;
}

type Param = Readonly<Item["path"]>;

export const fileChangesState = atomFamily<FileChangesState | undefined, Param>({
    key: "file/changes",
    default: undefined,
});

export const useSetChanges = (item: Param) =>
    useRecoilCallback(
        ({ set }) =>
            (content: string, version: unknown) => {
                set(fileChangesState(item), (prev = {}) => ({ ...prev, content, version }));
            },
        [item],
    );

export const useSetSavedVersion = (item: Param) =>
    useRecoilCallback(
        ({ set }) =>
            (version: unknown) => {
                set(fileChangesState(item), (prev = {}) => ({ ...prev, savedVersion: prev.savedVersion ?? version }));
            },
        [item],
    );

export const isFileHasChanges = selectorFamily({
    key: "file/changes/has",
    get:
        (item: Param | undefined = undefined) =>
        ({ get }) => {
            if (!item) return false;

            const { savedVersion, version } = get(fileChangesState(item)) ?? {};
            return savedVersion !== version;
        },
});
