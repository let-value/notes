import { Menu } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";
import { Item } from "models";
import { FC } from "react";
import { useDirectoryContextHandlers } from "./useDirectoryContextHandlers";

interface DirectoryContextMenuProps {
    item: Item<true>;
}

export const DirectoryContextMenu: FC<DirectoryContextMenuProps> = ({ item }) => {
    const { handleNewFile, handleNewDirectory, handleRefresh } = useDirectoryContextHandlers(item);

    return (
        <Menu>
            <MenuItem2 text="New File" onClick={handleNewFile} />
            <MenuItem2 text="New Folder" onClick={handleNewDirectory} />
            <MenuItem2 text="Refresh" onClick={handleRefresh} />
            <MenuItem2 text="Delete" intent="danger" />
        </Menu>
    );
};
