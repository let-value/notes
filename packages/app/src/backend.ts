import { id } from "@/tabId";
import { createBroadcastChannel } from "@/utils";
import { EventTarget } from "messaging";

export const browserBackend = {
    eventTarget: () => {
        console.debug("browserBackend.eventTarget");
        import("../../backend/browser/main").then(({ container }) => container.upsert({ tabId: id }));

        return createBroadcastChannel() as EventTarget;
    },
};

export const workerBackend = {
    eventTarget: () => {
        console.debug("workerBackend.eventTarget");
        const worker = new Worker(new URL("../../backend/worker/worker.ts", import.meta.url), { type: "module" });
        worker.postMessage(id);
        return createBroadcastChannel() as EventTarget;
    },
};
