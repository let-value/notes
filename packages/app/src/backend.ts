import { id } from "@/tabId";
import { createBroadcastChannel } from "@/utils";
import { EventTarget } from "messaging";
import { container } from "../../backend/browser/main";

export const browserBackend = {
    eventTarget: () => {
        container.upsert({ tabId: id });
        return createBroadcastChannel() as EventTarget;
    },
};

export const workerBackend = {
    eventTarget: () => {
        const worker = new Worker(new URL("../../backend/worker/worker.ts", import.meta.url), { type: "module" });
        worker.postMessage(id);
        return createBroadcastChannel() as EventTarget;
    },
};
