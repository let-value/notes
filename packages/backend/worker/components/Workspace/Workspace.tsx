import { useAsyncMemo } from "app/src/utils";
import { memo, useEffect, useMemo } from "react";
import { WorkspaceStore } from "../../workspace/WorkspaceStore";
import { TreeContext } from "../TreeContext";

import { Directory, TreeDirectoryNode } from "./Directory";
import { WorkspaceContext } from "./WorkspaceContext";

export class TreeWorkspaceNode extends TreeDirectoryNode {}

interface WorkspaceProps {
    store: WorkspaceStore;
}

export const Workspace = memo(function Workspace({ store }: WorkspaceProps) {
    const root = useAsyncMemo(() => store.fs.initializeWorkspace(store.workspace), [store]);

    const instance = useMemo(() => root && new TreeWorkspaceNode(root), [root]);

    useEffect(() => instance?.children.next([root]), [instance, root]);

    useEffect(() => {
        store.root.next(instance);
        return () => {
            store.root.next(undefined);
        };
    }, [instance, store.root]);

    if (!root) {
        return null;
    }

    return (
        <WorkspaceContext.Provider value={store}>
            <TreeContext.Provider value={instance}>
                <Directory {...root} />
            </TreeContext.Provider>
        </WorkspaceContext.Provider>
    );
});
