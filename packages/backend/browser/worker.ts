import { BroadcastChannel, createLeaderElection } from "broadcast-channel";
import { backend, BroadcastMessage } from "messaging";
import { container } from "./container";

const tabId = await new Promise<string>((resolve) =>
    self.addEventListener("message", (message) => resolve(message.data), { once: true }),
);

container.upsert({ tabId });

const id = container.get("id");
const broadcastChannel = container.get("eventTarget");

const elector = createLeaderElection(broadcastChannel as BroadcastChannel<BroadcastMessage>);
await elector.awaitLeadership();

console.trace("leader", id, tabId);

await import("./dom/setupDom");
await import("app/src/editor/setupMonaco");
await import("./features");

const dispatcher = container.get("dispatcher");
const response = backend.leader.response(id, undefined);

dispatcher.send(response);
