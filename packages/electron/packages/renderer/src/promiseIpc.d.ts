import { Listener } from "electron-promise-ipc/build/base";

declare global {
    interface Window {
        promiseIpc: {
            send: (route: string, ...args: unknown[]) => Promise<unknown>;
            on: (route: string, listener: Listener) => void;
            off: (route: string, listener: Listener) => void;
            removeListener: (route: string, listener?: Listener) => void;
        };
        ipcRenderer: {
            send: (channel: string, ...args: unknown[]) => void;
            on: (channel: string, listener: (...args: unknown[]) => void) => void;
            invoke: (channel: string, ...args: unknown[]) => Promise<any>;
        };
    }
}
