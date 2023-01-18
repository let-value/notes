import { Item, WorkspaceId } from "models";
import { useRecoilCallback } from "recoil";
import { workspaceItemsState, workspacePathsSelector } from "./workspaceItemsSelector";

export const useRefreshItem = (workspaceId: WorkspaceId) =>
    useRecoilCallback(
        ({ snapshot, refresh, reset, set }) =>
            async (item: Item<true>) => {
                const paths = await snapshot.getPromise(workspacePathsSelector(workspaceId));

                for (const path of paths) {
                    if (!path.startsWith(item.path)) {
                        continue;
                    }

                    set(workspacePathsSelector(workspaceId), (value) => {
                        const result = new Set(value);
                        result.delete(path);
                        return result;
                    });

                    //reset(workspaceItemsState({ workspaceId, path }));
                    refresh(workspaceItemsState({ workspaceId, path }));
                }
            },
        [workspaceId],
    );
