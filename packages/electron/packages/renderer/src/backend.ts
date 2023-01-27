import { EventTarget, WorkerEventTarget } from "messaging";

export const workerElectronBackend = {
    eventTarget: (): EventTarget => {
        console.debug("workerElectronBackend.eventTarget");

        const worker = new Worker(new URL("../../../../backend/electron/electron.ts", import.meta.url), {
            type: "module",
        });

        return new WorkerEventTarget(worker);
    },
};
