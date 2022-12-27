import { backend, EventTransport, send, setSource } from "@/messaging";
import { id } from "@/tabId";
import { createBroadcastChannel } from "@/utils";
import { createLeaderElection } from "broadcast-channel";
import "./features";

export let tabId: string | undefined = undefined;

self.addEventListener("message", (message) => {
    tabId = message.data;
});

const broadcastChannel = createBroadcastChannel();
setSource(broadcastChannel as EventTransport);

const elector = createLeaderElection(broadcastChannel);
await elector.awaitLeadership();

await send(backend.leader.response(id, undefined));
