import { useOpenEditorPanel } from "@/atom/panels";
import { workspaceTree } from "@/atom/workspace";
import { TreeNode } from "@blueprintjs/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import cx from "classnames";
import { join } from "lodash-es";
import { Item, Workspace } from "models";
import { FC, useCallback, useRef } from "react";
import { useRecoilValueLoadable } from "recoil";
import { useMap } from "usehooks-ts";
import styles from "./Explorer.module.css";

interface ExplorerProps {
    workspace: Workspace;
}

export const Explorer: FC<ExplorerProps> = ({ workspace }) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const [expand, { set: expandFolder, remove: collapseFolder }] = useMap<string, boolean>();
    const tree = useRecoilValueLoadable(
        workspaceTree({ workspaceId: workspace.id, expanded: Array.from(expand.keys()) }),
    );

    const rowVirtualizer = useVirtualizer({
        count: tree.contents?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40,
        overscan: 5,
    });

    const handleSelectFile = useOpenEditorPanel(workspace);

    const handleClick = useCallback(
        (item: Item) => {
            if (item.isDirectory) {
                const expanded = expand.get(item.path);
                if (expanded) {
                    collapseFolder(item.path);
                } else {
                    expandFolder(item.path, true);
                }
            } else {
                handleSelectFile(item);
            }
        },
        [collapseFolder, expand, expandFolder, handleSelectFile],
    );

    if (!workspace || tree.state !== "hasValue") {
        return null;
    }

    return (
        <div className="flex-1 h-full w-full overflow-hidden">
            <div ref={parentRef} className="overflow-y-auto overflow-x-hidden h-full">
                <div
                    className={cx(styles.tree, "relative bp4-tree-node-list")}
                    style={{ height: rowVirtualizer.getTotalSize() }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const item = tree.contents?.[virtualRow.index];

                        const segments = ([] as string[])
                            .concat((item.collapsed ?? []).map((item) => item.name))
                            .concat(item.name);

                        return (
                            <div
                                className="absolute whitespace-nowrap top-0 left-0 w-full"
                                key={virtualRow.index}
                                style={{ height: virtualRow.size, transform: `translateY(${virtualRow.start}px)` }}
                            >
                                <TreeNode
                                    id={item.path}
                                    icon={
                                        item.isDirectory
                                            ? expand.get(item.path)
                                                ? "folder-open"
                                                : "folder-close"
                                            : "document"
                                    }
                                    depth={item.depth}
                                    label={join(segments, " / ")}
                                    path={[]}
                                    onClick={() => handleClick(item)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
