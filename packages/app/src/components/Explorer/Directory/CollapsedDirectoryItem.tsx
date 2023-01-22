import { selectedItemsState } from "@/atom/workspace/items/selectedItemsState";
import { ContextMenu2 } from "@blueprintjs/popover2";
import cx from "classnames";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { useExplorerDnd } from "../Dnd/useExplorerDnd";
import styles from "./CollapsedDirectoryItem.module.scss";
import { DirectoryContextMenu } from "./DirectoryContextMenu";
import { DirectoryHandlersProps, useDirectoryHandlers } from "./useDirectoryItem";

type CollapsedDirectoryItemProps = DirectoryHandlersProps;

export const CollapsedDirectoryItem: FC<CollapsedDirectoryItemProps> = (props) => {
    const { item } = props;
    const { handleSelect } = useDirectoryHandlers(props);

    const selected = useRecoilValue(selectedItemsState);

    const { setRef, className, attributes, listeners } = useExplorerDnd(item);

    return (
        <ContextMenu2 tagName="span" content={<DirectoryContextMenu item={item} />}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
                ref={setRef}
                href="javascript:void(null);"
                className={cx(className, "rounded", styles.root, {
                    [styles.selected]: selected.has(item.path),
                })}
                onClick={handleSelect}
                {...attributes}
                {...listeners}
            >
                {item.name}
            </a>
        </ContextMenu2>
    );
};
