import { createBroadcastChannel } from "./broadcast/createBroadcastChannel";

class Broadcast {
    get channel() {
        const broadcastChannel = createBroadcastChannel();

        Object.defineProperty(this, "channel", {
            value: broadcastChannel,
            writable: false,
            configurable: false,
            enumerable: false,
        });

        return broadcastChannel;
    }
}

export const broadcast = new Broadcast();
