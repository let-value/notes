import { BroadcastChannel } from "broadcast-channel";
import { BroadcastMessage } from "./BroadcastMessage";

export const createBroadcastChannel = () => {
    const broadcastChannel = new BroadcastChannel<BroadcastMessage>("foobar", {
        type: "idb",
        webWorkerSupport: true,
    });

    console.log("createBroadcast", broadcastChannel);
    broadcastChannel.addEventListener("message", (message) => {
        console.log("global log", broadcastChannel, message);
    });

    return broadcastChannel;
};
