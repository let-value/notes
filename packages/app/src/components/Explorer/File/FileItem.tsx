import { ListItem } from "@/atom/workspace";
import { TreeNode } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";
import { Item } from "models";
import { ComponentProps, FC, useCallback } from "react";
import { FileContextMenu } from "./FileContextMenu";
import { NewFileItem } from "./NewFileItem";

interface FileItemProps extends Partial<ComponentProps<typeof TreeNode>> {
    item: ListItem<false>;
    onSelect: (item: Item<false>) => void;
}

export const FileItem: FC<FileItemProps> = ({ item, onSelect, ...other }) => {
    const handleSelect = useCallback(() => {
        onSelect(item);
    }, [item, onSelect]);

    if (item.new) {
        return <NewFileItem item={item} />;
    }

    return (
        <ContextMenu2 content={<FileContextMenu />}>
            <TreeNode
                id={item.path}
                icon="document"
                depth={item.depth}
                label={item.name}
                path={[]}
                onClick={handleSelect}
                {...other}
            />
        </ContextMenu2>
    );
};
