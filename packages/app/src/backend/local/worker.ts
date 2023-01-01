import { backend, EventTransport, send, setSource } from "@/messaging";
import { id } from "@/tabId";
import { createBroadcastChannel } from "@/utils";
import { createLeaderElection } from "broadcast-channel";

await import("./dom/setupDom");
await import("./features");

export let tabId: string | undefined = undefined;

self.addEventListener("message", (message) => {
    tabId = message.data;
});

const broadcastChannel = createBroadcastChannel();

const elector = createLeaderElection(broadcastChannel);
await elector.awaitLeadership();

setSource(broadcastChannel as EventTransport);

await send(backend.leader.response(id, undefined));
