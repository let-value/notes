import { MainMenu, MenuItem } from "app/src/state/menu";
import type { KeyboardEvent, MenuItem as ElectronMenuItem, MenuItemConstructorOptions } from "electron";
import { parse } from "flatted";
import { makeAutoObservable } from "mobx";
import { join } from "path";

export class ElectronMainMenu implements MenuItem {
    label = "Electron";
    type = "submenu" as const;
    lookup = new Map<string, MenuItem>();

    constructor(public mainMenu: MainMenu) {
        makeAutoObservable(this, { lookup: false });
        window.ipcRenderer.on("mainMenuClick", (event: string) => {
            const { menuItem } = parse(event) as { menuItem: ElectronMenuItem; keyboardEvent: KeyboardEvent };

            const menu = this.lookup.get(menuItem.id);
            menu.handler?.();
            console.log("ElectronMainMenu.mainMenuClick", menuItem);
        });
    }

    get items() {
        return this.mainMenu.items;
    }

    toTemplate(parent: string, menu: MenuItem) {
        const path = join(parent, menu.label ?? "");

        this.lookup.set(path, menu);

        const template: MenuItemConstructorOptions = {
            id: path,
            type: menu.type,
            checked: menu.checked,
            label: menu.label,
            enabled: !menu?.disabled,
            submenu: menu.items?.map((x) => this.toTemplate(path, x)) ?? [],
        };

        return template;
    }

    async update() {
        const template = this.items.map((x) => this.toTemplate(this.label, x));

        console.log("ElectronMainMenu.update", template);

        await window.ipcRenderer.send("mainMenu", template);
    }
}
