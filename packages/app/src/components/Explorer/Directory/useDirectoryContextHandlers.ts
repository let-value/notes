import { newItemState } from "@/atom/workspace";
import { useExpandItem } from "@/atom/workspace/items/expandedItemsState";
import { Item } from "models";
import { MouseEvent, useCallback } from "react";
import { useRecoilCallback } from "recoil";
import { useRefreshItem } from "../../../atom/workspace/items/useRefreshItem";

export function useDirectoryContextHandlers(item: Item<true>) {
    const expandDirectory = useExpandItem();

    const refreshItem = useRefreshItem();

    const handleNewDirectory = useRecoilCallback(
        ({ set }) =>
            (event: MouseEvent) => {
                event.stopPropagation();
                expandDirectory(item.path);

                set(newItemState, {
                    new: true,
                    name: "",
                    path: item.path,
                    isDirectory: true,
                    depth: 0,
                });
            },
        [expandDirectory, item.path],
    );

    const handleNewFile = useRecoilCallback(
        ({ set }) =>
            (event: MouseEvent) => {
                event.stopPropagation();
                expandDirectory(item.path);

                set(newItemState, {
                    new: true,
                    name: "",
                    path: item.path,
                    isDirectory: false,
                    depth: 0,
                });
            },
        [expandDirectory, item.path],
    );

    const handleRefresh = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();

            refreshItem(item);
        },
        [item, refreshItem],
    );

    return {
        handleNewDirectory,
        handleNewFile,
        handleRefresh,
    };
}
