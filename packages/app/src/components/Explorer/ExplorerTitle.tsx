import { workspaceRootSelector } from "@/atom/workspace";
import { Button, TreeNode } from "@blueprintjs/core";
import { useContext } from "react";
import { useRecoilValue } from "recoil";
import { useDirectoryContextHandlers } from "./Directory/useDirectoryContextHandlers";
import { ExplorerContext } from "./ExplorerContext";

export const ExplorerTitle = () => {
    const { workspace, expandState } = useContext(ExplorerContext);

    const handleResetExpand = expandState[1].reset;

    const root = useRecoilValue(workspaceRootSelector(workspace.id));

    const { handleNewFile, handleNewDirectory, handleRefresh } = useDirectoryContextHandlers(root);

    return (
        <div className="bp4-tree bp4-tree-node-list bp4-tree-root">
            <TreeNode
                id="root"
                className="group bp4-running-text"
                depth={0}
                path={[]}
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
