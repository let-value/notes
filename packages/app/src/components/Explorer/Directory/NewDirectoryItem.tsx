import { useCreateDirectory } from "@/atom/workspace";
import { ListItem } from "@/atom/workspace/items/ListItem";
import { EditableText, TreeNode } from "@blueprintjs/core";
import { ComponentProps, FC, useEffect, useRef } from "react";

interface NewDirectoryItemProps extends Partial<ComponentProps<typeof TreeNode>> {
    item: ListItem<true>;
}

export const NewDirectoryItem: FC<NewDirectoryItemProps> = (props) => {
    const { item, ...other } = props;

    const handleCreateDirectory = useCreateDirectory(item);

    const editor = useRef<EditableText>(null);
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (editor.current as any).inputElement.focus();
    }, []);

    return (
        <TreeNode
            id={item.path}
            icon="folder-close"
            depth={item.depth}
            label={
                <EditableText
                    ref={editor}
                    intent="primary"
                    isEditing
                    confirmOnEnterKey
                    alwaysRenderInput
                    placeholder="New Folder"
                    onConfirm={handleCreateDirectory}
                />
            }
            path={[]}
            {...other}
        />
    );
};
