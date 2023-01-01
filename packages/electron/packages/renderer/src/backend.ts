import { EventTarget } from "messaging";

export const worker = new Worker(new URL("../../../../backend/electron/worker.ts", import.meta.url), {
    type: "module",
});

export const electronBackend = {
    eventTarget: (): EventTarget => {
        return worker as unknown as EventTarget;
    },
};
