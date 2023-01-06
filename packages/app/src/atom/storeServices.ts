import { DispatcherService, MediatorService } from "messaging";

interface StoreServices {
    mediator: MediatorService;
    dispatcher: DispatcherService;
}

export let storeServices: StoreServices;

export function setStoreServices(services: StoreServices) {
    storeServices = services;
}
