import { useOpenEditorPanel } from "@/atom/panels";
import { ListItem, workspaceRootSelector, workspaceState, workspaceTree } from "@/atom/workspace";
import { expandedItemsState, useToggleExpandItem } from "@/atom/workspace/items/expandedItemsState";
import { selectedItemsState, useSelectItem, useToggleSelectItem } from "@/atom/workspace/items/selectedItemsState";
import { useVirtualizer } from "@tanstack/react-virtual";
import cx from "classnames";
import { MouseEvent, ReactNode, RefCallback, useCallback, useRef } from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { DirectoryItem } from "./Directory/DirectoryItem";
import { useExplorerDnd } from "./Dnd/useExplorerDnd";
import styles from "./Explorer.module.css";
import { FileItem } from "./File/FileItem";

export const ExplorerList = () => {
    const workspace = useRecoilValue(workspaceState);
    const parentRef = useRef<HTMLDivElement | null>(null);
    const handleParentRef = useCallback((instance: HTMLDivElement | null | RefCallback<HTMLDivElement>) => {
        if (typeof instance === "function") {
            return (element: HTMLDivElement | null) => {
                parentRef.current = element;
                instance(element);
            };
        }

        parentRef.current = instance;
    }, []);

    const root = useRecoilValue(workspaceRootSelector(workspace.id));

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
        (item: ListItem<false>, event: MouseEvent) => {
            if (event.ctrlKey) {
                toggleSelectItem(item);
                return;
            }

            openEditorPanel(item);
        },
        [openEditorPanel, toggleSelectItem],
    );

    const handleSelectDirectory = useCallback(
        (item: ListItem<true>, event: MouseEvent) => {
            if (event.ctrlKey) {
                toggleSelectItem(item);
                return;
            }

            selectItem(item, true);
            toggleExpand(item.path);
        },
        [selectItem, toggleExpand, toggleSelectItem],
    );

    const { setRef, className } = useExplorerDnd(root as ListItem, true);

    return (
        <div ref={handleParentRef(setRef)} className={cx(className, "flex-1 overflow-y-auto overflow-x-hidden h-full")}>
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
                            <FileItem item={item} isSelected={selected.has(item.path)} onSelect={handleSelectFile} />
                        );
                    }

                    return (
                        <div
                            className="absolute whitespace-nowrap top-0 left-0 w-full"
                            key={`${item.path}${item.new}`}
                            style={{
                                height: virtualRow.size,
                                top: virtualRow.start,
                                //transform: `translateY(${}px)`,
                            }}
                        >
                            {children}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
