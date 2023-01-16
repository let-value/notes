import { HotkeyConfig } from "@blueprintjs/core";

export type MenuItemType = "normal" | "separator" | "submenu" | "checkbox" | "radio";

export interface MenuItem {
    type: MenuItemType;
    label?: string;
    hotkey?: Partial<HotkeyConfig>;
    handler?: () => void;
    disabled?: boolean;
    checked?: boolean;
    items?: MenuItem[];
}
