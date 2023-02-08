import { ListItem } from "@/atom/workspace";
import { TreeNode } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";
import { ComponentProps, FC, MouseEvent, useCallback } from "react";
import { useExplorerDnd } from "../Dnd/useExplorerDnd";
import { FileContextMenu } from "./FileContextMenu";
import { NewFileItem } from "./NewFileItem";

interface FileItemProps extends Partial<ComponentProps<typeof TreeNode>> {
    item: ListItem<false>;
    onSelect: (item: ListItem<false>, event: MouseEvent) => void;
}

export const FileItem: FC<FileItemProps> = ({ item, onSelect, ...other }) => {
    const handleSelect = useCallback(
        (event: MouseEvent) => {
            onSelect(item, event);
        },
        [item, onSelect],
    );

    const { setRef, className } = useExplorerDnd(item);

    if (item.new) {
        return <NewFileItem item={item} />;
    }

    return (
        <ContextMenu2 content={<FileContextMenu item={item} />}>
            <div ref={setRef} className={className}>
                <TreeNode
                    id={item.path}
                    icon="document"
                    depth={item.depth}
                    label={item.name}
                    path={[]}
                    onClick={(_, event) => handleSelect(event)}
                    {...other}
                />
            </div>
        </ContextMenu2>
    );
};
