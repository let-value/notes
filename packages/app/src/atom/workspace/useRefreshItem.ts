import { Item, WorkspaceId } from "models";
import { useRecoilCallback } from "recoil";
import { workspaceItemsState, workspacePathsSelector } from "./workspaceItemsSelector";

export const useRefreshItem = (workspaceId: WorkspaceId) =>
    useRecoilCallback(
        ({ snapshot, refresh, set }) =>
            async (item: Item<true>) => {
                const paths = await snapshot.getPromise(workspacePathsSelector(workspaceId));

                for (const path of paths) {
                    if (!path.startsWith(item.path)) {
                        continue;
                    }

                    refresh(workspaceItemsState({ workspaceId, path }));
                    set(workspacePathsSelector(workspaceId), (value) => {
                        const result = new Set(value);
                        result.delete(item.path);
                        return result;
                    });
                }
            },
        [workspaceId],
    );
