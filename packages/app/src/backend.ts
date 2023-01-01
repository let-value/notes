import { id } from "@/tabId";
import { createBroadcastChannel } from "@/utils";
import { EventTarget } from "messaging";

export const worker = new Worker(new URL("../../backend/browser/worker.ts", import.meta.url), { type: "module" });
worker.postMessage(id);

export const browserBackend = {
    eventTarget: () => {
        return createBroadcastChannel() as EventTarget;
    },
};
