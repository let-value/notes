export type MenuItemType = "normal" | "separator" | "submenu" | "checkbox" | "radio";

export interface MenuItem {
    type: MenuItemType;
    label?: string;
    handler?: () => void;
    disabled?: boolean;
    checked?: boolean;
    items?: MenuItem[];
}
