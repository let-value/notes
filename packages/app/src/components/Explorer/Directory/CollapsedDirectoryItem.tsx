import { ContextMenu2 } from "@blueprintjs/popover2";
import { FC } from "react";
import { DirectoryContextMenu } from "./DirectoryContextMenu";
import { DirectoryHandlersProps, useDirectoryHandlers } from "./useDirectoryItem";

type CollapsedDirectoryItemProps = DirectoryHandlersProps;

export const CollapsedDirectoryItem: FC<CollapsedDirectoryItemProps> = (props) => {
    const { item } = props;
    const { handleSelect } = useDirectoryHandlers(props);

    return (
        <ContextMenu2 tagName="span" content={<DirectoryContextMenu item={item} />}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="javascript:void(null);" onClick={handleSelect}>
                {item.name}
            </a>
        </ContextMenu2>
    );
};
