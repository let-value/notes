import { Menu } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";
import { Item } from "models";
import { FC, useContext } from "react";
import { ExplorerContext } from "../ExplorerContext";
import { useDirectoryContextHandlers } from "./useDirectoryContextHandlers";

interface DirectoryContextMenuProps {
    item: Item<true>;
}

export const DirectoryContextMenu: FC<DirectoryContextMenuProps> = ({ item }) => {
    const { workspace } = useContext(ExplorerContext);

    const { handleRefresh } = useDirectoryContextHandlers(workspace, item);

    return (
        <Menu>
            <MenuItem2 text="Refresh" onClick={handleRefresh} />
            <MenuItem2 text="Delete" intent="danger" />
        </Menu>
    );
};
