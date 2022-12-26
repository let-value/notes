import { createLeaderElection } from "broadcast-channel";
import { v4 as uuidv4 } from "uuid";
import { BroadcastMessage } from "../broadcast";
import { createBroadcastChannel } from "../broadcast/createBroadcastChannel";
import { methods } from "./methods";

const id = uuidv4();

const broadcastChannel = createBroadcastChannel();
const elector = createLeaderElection(broadcastChannel);
await elector.awaitLeadership();

console.log("I am the leader", id, broadcastChannel);

broadcastChannel.addEventListener("message", async (message) => {
    if (message.type == "request" && message.name == methods.worker.name) {
        await broadcastChannel.postMessage(methods.worker.response(id, message as BroadcastMessage<"request">));
    }

    if (message.type == "request" && message.name == methods.workspaces.name) {
        await broadcastChannel.postMessage(methods.workspaces.response(id, message as BroadcastMessage<"request">));
    }
});

const action = methods.worker.response(id, undefined, id);
console.log("Initialized", action);
await broadcastChannel.postMessage(action);
