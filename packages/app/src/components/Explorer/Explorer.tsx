import { useSelectFile } from "@/atom/file/useSelectFile";
import { filesTree } from "@/atom/files/filesState";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AnnotationIcon, FolderCloseIcon, FolderOpenIcon, Menu, Pane } from "evergreen-ui";
import { join } from "lodash-es";
import { Item, TreeItem, Workspace } from "models";
import { FC, useCallback, useMemo, useRef } from "react";
import { useRecoilValueLoadable } from "recoil";
import { useMap } from "usehooks-ts";
import styles from "./Explorer.module.css";

interface QueueItem {
    collapsed: Item[];
    item: TreeItem;
    depth: number;
}

interface ListItem extends Item {
    collapsed?: Item[];
    depth: number;
}

interface ExplorerProps {
    workspace: Workspace;
}

export const Explorer: FC<ExplorerProps> = ({ workspace }) => {
    const tree = useRecoilValueLoadable(filesTree(workspace.id));

    const parentRef = useRef<HTMLDivElement>(null);

    const [expand, { set: expandFolder }] = useMap<string, boolean>();

    const list = useMemo(() => {
        const result: ListItem[] = [];

        if (tree.state !== "hasValue" || !tree.contents) {
            return result;
        }

        const queue: QueueItem[] = [{ collapsed: [], item: tree.contents, depth: 0 }];

        while (queue.length) {
            const branch = queue.shift();

            if (!branch) {
                continue;
            }

            if (branch.item.isDirectory && branch.item.children?.length === 1) {
                queue.unshift({
                    collapsed: [...branch.collapsed, branch.item],
                    item: branch.item.children[0],
                    depth: branch.depth,
                });
                continue;
            }

            result.push({
                ...branch.item,
                collapsed: branch.collapsed,
                depth: branch.depth,
            });

            if (branch.item.isDirectory && branch.item.children && expand.get(branch.item.path)) {
                const newItems = branch.item.children.map((item) => ({ collapsed: [], item, depth: branch.depth + 1 }));
                queue.unshift(...newItems);
            }
        }

        return result;
    }, [expand, tree.contents, tree.state]);

    const rowVirtualizer = useVirtualizer({
        count: list.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40,
        overscan: 5,
    });

    const handleSelectFile = useSelectFile();

    const handleClick = useCallback(
        (item: Item) => {
            if (item.isDirectory) {
                expandFolder(item.path, !expand.get(item.path));
            } else {
                handleSelectFile(item);
            }
        },
        [expand, expandFolder, handleSelectFile],
    );

    if (!workspace) {
        return null;
    }

    return (
        <Pane flex={1} height="100%" width="100%" overflow="hidden">
            <Pane ref={parentRef} overflowY="auto" overflowX="hidden" height="100%">
                <Pane className={styles.tree} height={rowVirtualizer.getTotalSize()} position="relative">
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const item = list[virtualRow.index];

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
