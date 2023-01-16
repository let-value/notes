/* eslint-disable @typescript-eslint/ban-types */
import { Container } from "iti";
import { DispatcherService, MediatorService } from "messaging";

interface AtomContext {
    mediator: MediatorService;
    dispatcher: DispatcherService;
}

export let context: AtomContext;

export const atomService = (container: Container<AtomContext, {}>) => {
    async function updateStoreServices() {
        const dispatcher = container.get("dispatcher");
        const mediator = container.get("mediator");
        context = {
            dispatcher,
            mediator,
        };
    }

    container.on("containerUpserted", updateStoreServices);
    container.on("containerUpdated", updateStoreServices);
    updateStoreServices();
};
