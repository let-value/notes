import { newItemState } from "@/atom/workspace";
import { Item } from "models";
import { MouseEvent, useCallback, useContext } from "react";
import { useRecoilCallback } from "recoil";
import { useRefreshItem } from "../../../atom/workspace/items/useRefreshItem";
import { ExplorerContext } from "../ExplorerContext";

export function useDirectoryContextHandlers(item: Item<true>) {
    const { workspace, expandState } = useContext(ExplorerContext);

    const handleExpandDirectory = useCallback(() => {
        expandState[1].set(item.path, true);
    }, [expandState, item.path]);

    const refreshItem = useRefreshItem(workspace.id);

    const handleNewDirectory = useRecoilCallback(
        ({ set }) =>
            (event: MouseEvent) => {
                event.stopPropagation();
                handleExpandDirectory();

                set(newItemState, {
                    new: true,
                    name: "",
                    path: item.path,
                    isDirectory: true,
                    depth: 0,
                });
            },
        [handleExpandDirectory, item.path],
    );

    const handleNewFile = useRecoilCallback(
        ({ set }) =>
            (event: MouseEvent) => {
                event.stopPropagation();
                handleExpandDirectory();

                set(newItemState, {
                    new: true,
                    name: "",
                    path: item.path,
                    isDirectory: false,
                    depth: 0,
                });
            },
        [handleExpandDirectory, item.path],
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
