import { useRefreshItem } from "@/atom/workspace/useRefreshItem";
import { Menu } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";
import { Item } from "models";
import { FC, useCallback, useContext } from "react";
import { ExplorerContext } from "../ExplorerContext";

interface DirectoryContextMenuProps {
    item: Item<true>;
}

export const DirectoryContextMenu: FC<DirectoryContextMenuProps> = ({ item }) => {
    const { workspace } = useContext(ExplorerContext);

    const refreshItem = useRefreshItem(workspace.id);

    const handleRefresh = useCallback(() => {
        refreshItem(item);
    }, [item, refreshItem]);

    return (
        <Menu>
            <MenuItem2 text="Refresh" onClick={handleRefresh} />
            <MenuItem2 text="Delete" intent="danger" />
        </Menu>
    );
};
