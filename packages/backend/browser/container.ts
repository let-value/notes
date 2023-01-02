import { createBroadcastChannel } from "app/src/utils";
import { createContainer } from "iti";
import { createDispatcherService, createMessagingService, EventTarget } from "messaging";
import { id } from "./workerId";

const broadcastChannel = createBroadcastChannel();

export const container = createContainer()
    .add({ id, tabId: () => "" })
    .add({ eventTarget: () => broadcastChannel as EventTarget })
    .add(createMessagingService)
    .add(createDispatcherService);