import { ListItem } from "@/atom/workspace/items/ListItem";
import { Spinner, TreeNode } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";
import { Item } from "models";
import { ComponentProps, FC, Fragment, useMemo } from "react";
import { CollapsedDirectoryItem } from "./CollapsedDirectoryItem";
import { DirectoryContextMenu } from "./DirectoryContextMenu";
import { NewDirectoryItem } from "./NewDirectoryItem";
import { DirectoryHandlersProps, useDirectoryHandlers } from "./useDirectoryItem";

interface DirectoryItemProps extends Partial<ComponentProps<typeof TreeNode>>, DirectoryHandlersProps {
    item: ListItem<true>;
    onSelect: (item: Item<true>) => void;
}

export const DirectoryItem: FC<DirectoryItemProps> = (props) => {
    const { item, isExpanded, onSelect, ...other } = props;

    const segments = useMemo(
        () =>
            ([] as JSX.Element[])
                .concat(
                    (item.collapsed ?? [])
                        .map((item, index): JSX.Element[] => [
                            <CollapsedDirectoryItem key={`item${index}`} item={item} onSelect={onSelect} />,
                            <span key={`separator${index}`}> / </span>,
                        ])
                        .flat(),
                )
                .concat(<Fragment key="directory">{item.name}</Fragment>),
        [item.collapsed, item.name, onSelect],
    );

    const { handleSelect } = useDirectoryHandlers(props);

    if (item.new) {
        return <NewDirectoryItem item={item} />;
    }

    return (
        <ContextMenu2 content={<DirectoryContextMenu item={item} />}>
            <TreeNode
                hasCaret
                id={item.path}
                isExpanded={isExpanded}
                secondaryLabel={item.loading ? <Spinner size={5} /> : undefined}
                icon={isExpanded ? "folder-open" : "folder-close"}
                depth={item.depth}
                label={<>{segments}</>}
                path={[]}
                onClick={handleSelect}
                onExpand={handleSelect}
                onCollapse={handleSelect}
                {...other}
            />
        </ContextMenu2>
    );
};
