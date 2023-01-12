import { EventTarget, WorkerEventTarget } from "messaging";

export const workerElectronBackend = {
    eventTarget: (): EventTarget => {
        const worker = new Worker(new URL("../../../../backend/electron/worker.ts", import.meta.url), {
            type: "module",
        });

        return new WorkerEventTarget(worker);
    },
};
