import { useOpenEditorPanel } from "@/atom/panels";
import { workspaceTree } from "@/atom/workspace";
import { useVirtualizer } from "@tanstack/react-virtual";
import cx from "classnames";
import { Item, Workspace } from "models";
import { FC, ReactNode, useCallback, useMemo, useRef } from "react";
import { useRecoilValueLoadable } from "recoil";
import { useMap } from "usehooks-ts";
import { DirectoryItem } from "./Directory/DirectoryItem";
import styles from "./Explorer.module.css";
import { ExplorerContext } from "./ExplorerContext";
import { FileItem } from "./File/FileItem";

interface ExplorerProps {
    workspace: Workspace;
}

export const Explorer: FC<ExplorerProps> = ({ workspace }) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const [expand, { set: expandFolder, remove: collapseFolder }] = useMap<string, boolean>([
        [`/${workspace.id}`, true],
    ]);

    const tree = useRecoilValueLoadable(
        workspaceTree({ workspaceId: workspace.id, expanded: Array.from(expand.keys()) }),
    );

    const rowVirtualizer = useVirtualizer({
        count: tree.contents?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 30,
        overscan: 5,
    });

    const handleSelectFile = useOpenEditorPanel(workspace);

    const handleSelectDirectory = useCallback(
        (item: Item<true>) => {
            const expanded = expand.get(item.path);
            if (expanded) {
                collapseFolder(item.path);
            } else {
                expandFolder(item.path, true);
            }
        },
        [collapseFolder, expand, expandFolder],
    );

    const context = useMemo(() => ({ workspace }), [workspace]);

    if (!workspace || tree.state !== "hasValue") {
        return null;
    }

    return (
        <ExplorerContext.Provider value={context}>
            <div className="flex-1 h-full w-full overflow-hidden">
                <div ref={parentRef} className="overflow-y-auto overflow-x-hidden h-full">
                    <div
                        className={cx(styles.tree, "relative bp4-tree bp4-tree-node-list bp4-tree-root")}
                        style={{ height: rowVirtualizer.getTotalSize() }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const item = tree.contents?.[virtualRow.index];

                            let children: ReactNode;

                            if (item.isDirectory) {
                                children = (
                                    <DirectoryItem
                                        item={item}
                                        isExpanded={expand.get(item.path)}
                                        onSelect={handleSelectDirectory}
                                    />
                                );
                            }

                            if (!item.isDirectory) {
                                children = <FileItem item={item} onSelect={handleSelectFile} />;
                            }

                            return (
                                <div
                                    className="absolute whitespace-nowrap top-0 left-0 w-full"
                                    key={item.path}
                                    style={{ height: virtualRow.size, transform: `translateY(${virtualRow.start}px)` }}
                                >
                                    {children}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </ExplorerContext.Provider>
    );
};
