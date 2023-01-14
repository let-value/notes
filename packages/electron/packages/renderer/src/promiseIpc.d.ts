import { PromiseIpcRenderer } from "electron-promise-ipc/build/renderer";

declare global {
    interface Window {
        promiseIpc: PromiseIpcRenderer;
    }
}
