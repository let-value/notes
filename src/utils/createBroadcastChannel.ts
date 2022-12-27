import { BroadcastChannel } from "broadcast-channel";
import { BroadcastMessage } from "../messaging/BroadcastMessage";

export const createBroadcastChannel = () => {
    const broadcastChannel = new BroadcastChannel<BroadcastMessage>("foobar", {
        type: "idb",
        webWorkerSupport: true,
    });

    return broadcastChannel;
};
