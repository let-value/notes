import { useCreateFile } from "@/atom/workspace";
import { ListItem } from "@/atom/workspace/items/ListItem";
import { EditableText, TreeNode } from "@blueprintjs/core";
import { ComponentProps, FC, useEffect, useRef } from "react";

interface NewFileItemProps extends Partial<ComponentProps<typeof TreeNode>> {
    item: ListItem<false>;
}

export const NewFileItem: FC<NewFileItemProps> = (props) => {
    const { item, ...other } = props;

    const handleCreateFile = useCreateFile(item);
    const editor = useRef<EditableText>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (editor.current as any).inputElement.focus();
    }, []);

    return (
        <TreeNode
            id={item.path}
            icon="document"
            depth={item.depth}
            label={
                <EditableText
                    ref={editor}
                    className="w-full"
                    intent="primary"
                    isEditing
                    confirmOnEnterKey
                    alwaysRenderInput
                    placeholder="New File"
                    onConfirm={handleCreateFile}
                />
            }
            path={[]}
            {...other}
        />
    );
};
