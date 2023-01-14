import { BrowserWindow, dialog, IpcMainEvent, OpenDialogOptions } from "electron";
import { Listener } from "electron-promise-ipc/build/base";
import promiseIpc from "electron-promise-ipc/build/mainProcess";

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
