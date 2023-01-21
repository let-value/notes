import { Item } from "models";
import { useRecoilCallback } from "recoil";
import { workspaceState } from "../workspace";
import { workspaceItemsState, workspacePathsSelector } from "./workspaceItemsSelector";

export const useRefreshItem = () =>
    useRecoilCallback(
        ({ snapshot, refresh, set }) =>
            async (item: Item<true>) => {
                const workspace = await snapshot.getPromise(workspaceState);

                const paths = await snapshot.getPromise(workspacePathsSelector(workspace.id));

                for (const path of paths) {
                    if (!path.startsWith(item.path)) {
                        continue;
                    }

                    set(workspacePathsSelector(workspace.id), (value) => {
                        const result = new Set(value);
                        result.delete(path);
                        return result;
                    });

                    refresh(workspaceItemsState({ workspaceId: workspace?.id, path }));
                }
            },
        [],
    );
