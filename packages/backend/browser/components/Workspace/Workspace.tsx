import { filesToTree, useAsyncMemo } from "app/src/utils";
import { useMemo } from "react";
import { WorkspaceStore } from "../../workspace/WorkspaceStore";
import { Directory } from "./Directory";
import { WorkspaceContext } from "./WorkspaceContext";

interface WorkspaceProps {
    store: WorkspaceStore;
}

export function Workspace({ store }: WorkspaceProps) {
    const files = useAsyncMemo(() => store.fs.getItems(), [store], undefined);
    const root = useMemo(() => {
        if (!files) {
            return undefined;
        }

        const { root } = filesToTree(store.workspace.id, files);
        return root;
    }, [files, store]);

    console.log("Workspace", files, root);

    return <WorkspaceContext.Provider value={store}>{root && <Directory item={root} />}</WorkspaceContext.Provider>;
}
