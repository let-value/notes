import { activePanelParams$ } from "@/atom/panels";
import { setRecoil } from "@/atom/tunnel";
import { atom, useRecoilCallback } from "recoil";

export const selectedItemsState = atom<Set<string>>({
    key: "workspace/items/selected",
    default: new Set(),
});

activePanelParams$.subscribe((x) => {
    if (!x?.item) {
        return;
    }

    setRecoil(selectedItemsState, new Set([x.item.path]));
});

export const useSelectItem = () =>
    useRecoilCallback(({ set }) => (path: string, exclusive = false) => {
        set(selectedItemsState, (prev) => {
            const next = new Set(exclusive ? undefined : prev);
            next.add(path);
            return next;
        });
    });

export const useToggleSelectItem = () =>
    useRecoilCallback(({ set }) => (path: string) => {
        set(selectedItemsState, (prev) => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    });
