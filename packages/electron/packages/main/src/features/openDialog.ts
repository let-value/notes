import { BrowserWindow, dialog, IpcMainEvent, OpenDialogOptions } from "electron";
import promiseIpc from "electron-promise-ipc";
import { Listener } from "electron-promise-ipc/build/base";

promiseIpc.on("openDialog", function (options: OpenDialogOptions, event?: IpcMainEvent) {
    if (!event) {
        return;
    }
    const window = BrowserWindow.fromWebContents(event.sender);

    if (!window) {
        return;
    }

    return dialog.showOpenDialog(window, options);
} as Listener);
