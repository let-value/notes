import { useAsyncMemo } from "app/src/utils";
import { memo, useMemo } from "react";
import { useBoolean } from "usehooks-ts";
import { WorkspaceStore } from "../../workspace/WorkspaceStore";
import { Directory } from "./Directory";
import { NestedItemsContext, useWorkspaceItem } from "./useWorkspaceItem";
import { WorkspaceContext } from "./WorkspaceContext";

interface WorkspaceProps {
    store: WorkspaceStore;
}

export const Workspace = memo(function Workspace({ store }: WorkspaceProps) {
    const suspended = useBoolean();
    const root = useAsyncMemo(() => store.fs.getWorkspaceItem(), [store], undefined);
    const instance = useMemo(() => ({ suspended }), [suspended]);

    const { treeNode } = useWorkspaceItem(root, instance);

    if (!root || suspended.value) {
        return null;
    }

    console.log(treeNode);

    return (
        <WorkspaceContext.Provider value={store}>
            <NestedItemsContext.Provider value={treeNode}>
                <Directory {...root} />
            </NestedItemsContext.Provider>
        </WorkspaceContext.Provider>
    );
});
