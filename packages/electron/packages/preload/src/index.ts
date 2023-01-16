/**
 * @module preload
 */

import { contextBridge, ipcRenderer } from "electron";
import promiseIpc, { type RendererProcessType } from "electron-promise-ipc";
import type { Listener } from "electron-promise-ipc/build/base";

const promiseIpcApi = {
    send: (route: string, ...args: unknown[]) => (promiseIpc as RendererProcessType).send(route, ...args),
    on: (route: string, listener: Listener) => {
        (promiseIpc as RendererProcessType).on(route, listener);
    },
    off: (route: string, listener: Listener) => (promiseIpc as RendererProcessType).off(route, listener),
    removeListener: (route: string, listener?: Listener) =>
        (promiseIpc as RendererProcessType).removeListener(route, listener),
};

contextBridge.exposeInMainWorld("promiseIpc", promiseIpcApi);

const ipcRendererApi = {
    send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),
    on: (channel: string, listener: (...args: unknown[]) => void) => {
        ipcRenderer.on(channel, (event, ...args) => listener(...args));
    },
    invoke: (channel: string, ...args: unknown[]) => {
        return ipcRenderer.invoke(channel, args);
    },
};

contextBridge.exposeInMainWorld("ipcRenderer", ipcRendererApi);
