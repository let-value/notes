import { activePanelParams$ } from "@/atom/panels";
import { setRecoil } from "@/atom/tunnel";
import { atom, useRecoilCallback } from "recoil";
import { ListItem } from "./ListItem";

export const selectedItemsState = atom<Map<string, ListItem>>({
    key: "workspace/items/selected",
    default: new Map(),
});

activePanelParams$.subscribe((x) => {
    if (!x?.item) {
        return;
    }

    setRecoil(selectedItemsState, new Map([[x.item.path, x.item]]));
});

export const useSelectItem = () =>
    useRecoilCallback(({ set }) => (item: ListItem, exclusive = false) => {
        set(selectedItemsState, (prev) => {
            const next = new Map(exclusive ? undefined : prev);
            next.set(item.path, item);
            return next;
        });
    });

export const useToggleSelectItem = () =>
    useRecoilCallback(({ set }) => (item: ListItem) => {
        set(selectedItemsState, (prev) => {
            const next = new Map(prev);
            if (next.has(item.path)) {
                next.delete(item.path);
            } else {
                next.set(item.path, item);
            }
            return next;
        });
    });
