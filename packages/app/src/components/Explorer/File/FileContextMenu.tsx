import { ListItem } from "@/atom/workspace";
import { resolveEditors } from "@/components/Editors/editorsRegistry";
import { Menu, MenuDivider } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";
import { FC, useMemo } from "react";
import { useFileContextHandlers } from "./useFileContextHandlers";

interface FileContextMenuProps {
    item: ListItem<false>;
}

export const FileContextMenu: FC<FileContextMenuProps> = ({ item }) => {
    const editors = useMemo(() => Object.entries(resolveEditors(item)), [item]);

    const { handleOpen } = useFileContextHandlers(item);

    return (
        <Menu>
            <MenuItem2 text="Open" onClick={handleOpen} />
            {editors.length > 1 ? (
                <MenuItem2 text="Open with">
                    {editors.map(([editor]) => (
                        <MenuItem2 key={editor} text={editor} onClick={(event) => handleOpen(event, editor)} />
                    ))}
                </MenuItem2>
            ) : null}
            <MenuDivider />
            <MenuItem2 text="Rename" />
            <MenuItem2 text="Delete..." intent="danger" />
        </Menu>
    );
};
