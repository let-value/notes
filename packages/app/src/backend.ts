import { id } from "@/tabId";
import { createBroadcastChannel } from "@/utils";
import { EventTarget } from "messaging";

export const browserBackend = {
    eventTarget: () => {
        const worker = new Worker(new URL("../../backend/browser/worker.ts", import.meta.url), { type: "module" });
        worker.postMessage(id);
        return createBroadcastChannel() as EventTarget;
    },
};
