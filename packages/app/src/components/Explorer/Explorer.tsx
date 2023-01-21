import { useOpenEditorPanel } from "@/atom/panels";
import { workspaceTree } from "@/atom/workspace";
import { expandedItemsState, useToggleExpandItem } from "@/atom/workspace/items/expandedItemsState";
import { selectedItemsState, useSelectItem, useToggleSelectItem } from "@/atom/workspace/items/selectedItemsState";
import { useVirtualizer } from "@tanstack/react-virtual";
import cx from "classnames";
import { Item, Workspace } from "models";
import { FC, MouseEvent, ReactNode, useCallback, useRef } from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { DirectoryItem } from "./Directory/DirectoryItem";
import styles from "./Explorer.module.css";
import { ExplorerTitle } from "./ExplorerTitle";
import { FileItem } from "./File/FileItem";

interface ExplorerProps {
    workspace: Workspace;
}

export const Explorer: FC<ExplorerProps> = ({ workspace }) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const selected = useRecoilValue(selectedItemsState);
    const toggleSelectItem = useToggleSelectItem();
    const selectItem = useSelectItem();

    const expanded = useRecoilValue(expandedItemsState);
    const toggleExpand = useToggleExpandItem();

    const tree = useRecoilValueLoadable(workspaceTree({ workspaceId: workspace.id, expanded }));

    const rowVirtualizer = useVirtualizer({
        count: tree.contents?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 30,
        overscan: 5,
    });

    const openEditorPanel = useOpenEditorPanel(workspace);
    const handleSelectFile = useCallback(
        (item: Item<false>, event: MouseEvent) => {
            if (event.ctrlKey) {
                toggleSelectItem(item.path);
                return;
            }

            openEditorPanel(item);
        },
        [openEditorPanel, toggleSelectItem],
    );

    const handleSelectDirectory = useCallback(
        (item: Item<true>, event: MouseEvent) => {
            if (event.ctrlKey) {
                toggleSelectItem(item.path);
                return;
            }

            selectItem(item.path, true);
            toggleExpand(item.path);
        },
        [selectItem, toggleExpand, toggleSelectItem],
    );

    if (!workspace || tree.state !== "hasValue") {
        return null;
    }

    return (
        <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
            <ExplorerTitle />
            <div ref={parentRef} className="flex-1 overflow-y-auto overflow-x-hidden h-full">
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
                                    isExpanded={expanded.has(item.path)}
                                    isSelected={selected.has(item.path)}
                                    onSelect={handleSelectDirectory}
                                />
                            );
                        }

                        if (!item.isDirectory) {
                            children = (
                                <FileItem
                                    item={item}
                                    isSelected={selected.has(item.path)}
                                    onSelect={handleSelectFile}
                                />
                            );
                        }

                        return (
                            <div
                                className="absolute whitespace-nowrap top-0 left-0 w-full"
                                key={`${item.path}${item.new}`}
                                style={{ height: virtualRow.size, transform: `translateY(${virtualRow.start}px)` }}
                            >
                                {children}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
