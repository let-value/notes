import { BroadcastChannel, createLeaderElection } from "broadcast-channel";
import { backend, BroadcastMessage } from "messaging";
import { container } from "./container";

export let resolveTabId: (tabId: string) => void;
const tabId = await new Promise<string>((resolve) => {
    resolveTabId = resolve;
    self.addEventListener("message", (message: MessageEvent) => resolve(message.data), { once: true });
});

container.upsert({ tabId });

const id = container.get("id");
const broadcastChannel = container.get("eventTarget");

const elector = createLeaderElection(broadcastChannel as BroadcastChannel<BroadcastMessage>);
await elector.awaitLeadership();

console.debug("leader", id, tabId);

await import("./dom/setupDom");
await import("app/src/editor/setupMonaco");
await import("./controllers");

const dispatcher = container.get("dispatcher");
const response = backend.leader.response(id, undefined);

dispatcher.send(response);
