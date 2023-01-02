import { createContainer } from "iti";
import { createDispatcherService, createMessagingService } from "messaging";

import { browserBackend } from "./backend";
import { id } from "./tabId";

export const container = createContainer()
    .add({ id })
    .add(browserBackend)
    .add(createMessagingService)
    .add(createDispatcherService);
