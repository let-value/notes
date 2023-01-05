import { memo, useEffect, useMemo } from "react";
import { useReactiveValue } from "../../utils/useReactiveValue";
import { WorkspaceStore } from "../../workspace/WorkspaceStore";
import { TreeContext } from "../TreeContext";

import { Directory, TreeDirectoryNode } from "./Directory";
import { WorkspaceContext } from "./WorkspaceContext";

export class TreeWorkspaceNode extends TreeDirectoryNode {}

interface WorkspaceProps {
    store: WorkspaceStore;
}

export const Workspace = memo(function Workspace({ store }: WorkspaceProps) {
    const root = useMemo(() => store.fs.getWorkspaceItem(), [store]);

    const instance = useMemo(() => new TreeWorkspaceNode(root), [root]);
    const [suspended] = useReactiveValue(instance.suspended, false);

    useEffect(() => {
        store.treeSource.next(instance);
        return () => {
            store.treeSource.next(undefined);
        };
    }, [instance, store.treeSource]);

    if (!root || suspended) {
        return null;
    }

    console.log(instance);

    return (
        <WorkspaceContext.Provider value={store}>
            <TreeContext.Provider value={instance}>
                <Directory {...root} />
            </TreeContext.Provider>
        </WorkspaceContext.Provider>
    );
});
