import {
    BrowserWindow,
    ipcMain,
    IpcMainEvent,
    KeyboardEvent,
    Menu,
    MenuItem,
    MenuItemConstructorOptions,
} from "electron";
import { stringify } from "flatted";
import { flatMapDeep } from "lodash";

ipcMain.on("mainMenu", function (event: IpcMainEvent, template: MenuItemConstructorOptions[]) {
    function handleClick(menuItem: MenuItem, browserWindow: BrowserWindow | undefined, keyboardEvent: KeyboardEvent) {
        const args = stringify({ menuItem, keyboardEvent });

        if (browserWindow) {
            browserWindow.webContents.send("mainMenuClick", args);
        } else {
            event.sender.postMessage("mainMenuClick", args);
        }
    }

    flatMapDeep(template, (x: MenuItemConstructorOptions) => x.submenu as MenuItemConstructorOptions[]).forEach(
        (item) => {
            if (!item) {
                return;
            }

            item.click = handleClick;
        },
    );

    const menu = Menu.buildFromTemplate(template);
    console.log("mainMenu", menu);
    Menu.setApplicationMenu(menu);
});
