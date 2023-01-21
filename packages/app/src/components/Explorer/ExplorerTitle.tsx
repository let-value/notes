import { workspaceRootSelector, workspaceState } from "@/atom/workspace";
import { useResetExpand } from "@/atom/workspace/items/expandedItemsState";
import { Button, TreeNode } from "@blueprintjs/core";
import { useRecoilValue } from "recoil";
import { useDirectoryContextHandlers } from "./Directory/useDirectoryContextHandlers";

export const ExplorerTitle = () => {
    const workspace = useRecoilValue(workspaceState);

    const handleResetExpand = useResetExpand();

    const root = useRecoilValue(workspaceRootSelector(workspace.id));

    const { handleNewFile, handleNewDirectory, handleRefresh } = useDirectoryContextHandlers(root);

    return (
        <div className="bp4-tree bp4-tree-node-list bp4-tree-root">
            <TreeNode
                id="root"
                className="group bp4-running-text"
                depth={0}
                path={[]}
                icon="projects"
                label={<span>{root.name}</span>}
                secondaryLabel={
                    <div className="hidden flex-nowrap group-hover:flex">
                        <Button small minimal icon="annotation" onClick={handleNewFile} />
                        <Button small minimal icon="folder-new" onClick={handleNewDirectory} />
                        <Button small minimal icon="refresh" onClick={handleRefresh} />
                        <Button small minimal icon="collapse-all" onClick={handleResetExpand} />
                    </div>
                }
            />
        </div>
    );
};
