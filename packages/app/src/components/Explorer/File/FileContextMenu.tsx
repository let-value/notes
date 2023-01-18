import { Menu } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";

export const FileContextMenu = () => {
    return (
        <Menu>
            <MenuItem2 text="Save" />
            <MenuItem2 text="Save as..." />
            <MenuItem2 text="Delete..." intent="danger" />
        </Menu>
    );
};
