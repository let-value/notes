import { createBroadcastChannel } from "app/src/utils";
import { EventTarget } from "messaging";

export const eventTargetService = {
    eventTarget: () => createBroadcastChannel() as EventTarget,
};
