import { atom, useRecoilCallback } from "recoil";

export const expandedItemsState = atom<Set<string>>({
    key: "workspace/items/expanded",
    default: new Set(),
});

export const useToggleExpandItem = () =>
    useRecoilCallback(
        ({ set }) =>
            (path: string) =>
                set(expandedItemsState, (prev) => {
                    const next = new Set(prev);
                    if (next.has(path)) {
                        next.delete(path);
                    } else {
                        next.add(path);
                    }
                    return next;
                }),
        [],
    );

export const useExpandItem = () =>
    useRecoilCallback(
        ({ set }) =>
            (path: string) =>
                set(expandedItemsState, (prev) => {
                    const next = new Set(prev);
                    next.add(path);
                    return next;
                }),
        [],
    );

export const useResetExpand = () =>
    useRecoilCallback(
        ({ set }) =>
            () =>
                set(expandedItemsState, new Set()),
        [],
    );
