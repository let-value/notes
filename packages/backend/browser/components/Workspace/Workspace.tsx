import { useAsyncMemo } from "app/src/utils";
import { useMemo } from "react";
import { useBoolean } from "usehooks-ts";
import { WorkspaceStore } from "../../workspace/WorkspaceStore";
import { Directory } from "./Directory";
import { NestedItemsContext, useWorkspace } from "./useWorkspaceItem";
import { WorkspaceContext } from "./WorkspaceContext";

interface WorkspaceProps {
    store: WorkspaceStore;
}

export function Workspace({ store }: WorkspaceProps) {
    const suspended = useBoolean();
    const root = useAsyncMemo(() => store.fs.getWorkspaceItem(), [store], undefined);
    const instance = useMemo(() => ({ suspended }), [suspended]);

    const { treeNode } = useWorkspace(root, instance);

    if (!root || suspended.value) {
        return null;
    }

    return (
        <WorkspaceContext.Provider value={store}>
            <NestedItemsContext.Provider value={treeNode}>
                <Directory item={root} />
            </NestedItemsContext.Provider>
        </WorkspaceContext.Provider>
    );
}
