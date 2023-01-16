import { DispatcherService, MediatorService } from "messaging";

interface AtomContext {
    mediator: MediatorService;
    dispatcher: DispatcherService;
}

export let context: AtomContext;

export const atomService = (services: AtomContext) => {
    context = services;

    return {
        store: undefined,
    };
};
