import { createLeaderElection } from "broadcast-channel";
import { backend, broadcastChannel, send } from "../messaging";
import { id } from "../tabId";
import "./features";

export let tabId: string | undefined = undefined;

self.addEventListener("message", (message) => {
    tabId = message.data;
});

const elector = createLeaderElection(broadcastChannel);
await elector.awaitLeadership();

await send(backend.leader.response(id, undefined));
