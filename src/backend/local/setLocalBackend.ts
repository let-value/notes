import { EventTransport, setSource } from "@/messaging";
import { id } from "@/tabId";
import { createBroadcastChannel } from "@/utils";

export const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
worker.postMessage(id);

const broadcastChannel = createBroadcastChannel();
setSource(broadcastChannel as EventTransport);
