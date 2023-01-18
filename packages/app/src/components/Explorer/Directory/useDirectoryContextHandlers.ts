import { useRefreshItem } from "@/atom/workspace/useRefreshItem";
import { Item, Workspace } from "models";
import { MouseEvent, useCallback } from "react";

export function useDirectoryContextHandlers(workspace: Workspace, item: Item<true>) {
    const refreshItem = useRefreshItem(workspace.id);

    const handleRefresh = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();

            refreshItem(item);
        },
        [item, refreshItem],
    );

    return {
        handleRefresh,
    };
}
