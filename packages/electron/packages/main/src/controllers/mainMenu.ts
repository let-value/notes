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

ipcMain.on("mainMenu", function (event: IpcMainEvent, template: MenuItemConstructorOptions[]) {
    function handleClick(menuItem: MenuItem, browserWindow: BrowserWindow | undefined, keyboardEvent: KeyboardEvent) {
        const args = stringify({ menuItem, keyboardEvent });

        if (browserWindow) {
            browserWindow.webContents.send("mainMenuClick", args);
        } else {
            event.sender.postMessage("mainMenuClick", args);
        }
    }

    const queue = [...template];

    while (queue.length > 0) {
        const item = queue.shift();

        if (!item) {
            continue;
        }

        if (item.submenu) {
            queue.push(...(item.submenu as MenuItemConstructorOptions[]));
        }

        item.click = handleClick;
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});
