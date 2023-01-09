import { createBroadcastChannel } from "app/src/utils";
import { createContainer } from "iti";
import { createDispatcherService, createMessagingService, EventTarget } from "messaging";
import { queueService } from "queue";
import { id } from "./workerId";

const broadcastChannel = createBroadcastChannel();

export const container = createContainer()
    .add({ id, tabId: () => "" })
    .add(queueService)
    .add({ eventTarget: () => broadcastChannel as EventTarget })
    .add(createMessagingService)
    .add(createDispatcherService);
