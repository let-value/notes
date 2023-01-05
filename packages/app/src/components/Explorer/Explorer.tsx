import { useSelectFile } from "@/atom/file/useSelectFile";
import { workspaceTree } from "@/atom/files/filesState";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AnnotationIcon, FolderCloseIcon, FolderOpenIcon, Menu, Pane } from "evergreen-ui";
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

    const handleSelectFile = useSelectFile();

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
        <Pane flex={1} height="100%" width="100%" overflow="hidden">
            <Pane ref={parentRef} overflowY="auto" overflowX="hidden" height="100%">
                <Pane className={styles.tree} height={rowVirtualizer.getTotalSize()} position="relative">
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const item = tree.contents?.[virtualRow.index];

                        const segments = ([] as string[])
                            .concat((item.collapsed ?? []).map((item) => item.name))
                            .concat(item.name);

                        return (
                            <Menu.Item
                                key={virtualRow.index}
                                icon={
                                    item.isDirectory
                                        ? expand.get(item.path)
                                            ? FolderOpenIcon
                                            : FolderCloseIcon
                                        : AnnotationIcon
                                }
                                position="absolute"
                                whiteSpace="nowrap"
                                top={0}
                                left={0}
                                width="100%"
                                height={virtualRow.size}
                                paddingLeft={`calc(${item.depth} * var(--indentation-size))`}
                                transform={`translateY(${virtualRow.start}px)`}
                                onClick={() => handleClick(item)}
                            >
                                {join(segments, " / ")}
                            </Menu.Item>
                        );
                    })}
                </Pane>
            </Pane>
        </Pane>
    );
};
