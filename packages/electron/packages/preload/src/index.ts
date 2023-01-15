/**
 * @module preload
 */

import { contextBridge } from "electron";
import promiseIpc from "electron-promise-ipc/build/renderer";

export { promiseIpc };

contextBridge.exposeInMainWorld("promiseIpc", {
    send: (route: string, ...args: unknown[]) => promiseIpc.send(route, ...args),
});
