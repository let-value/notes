import type { ContextGetter } from "iti/dist/src/_utils";
import { EventTarget } from "./EventTarget";
import { createMediator, MediatorFactoryResult } from "./mediator";

export type MediatorService = MediatorFactoryResult["mediator"] & {
    dispatch: MediatorFactoryResult["dispatch"];
};

export const createMessagingService = (
    services: ContextGetter<{
        id: () => string;
        eventTarget: () => EventTarget;
    }>,
) => ({
    mediator: () => {
        console.debug("createMessagingService.mediator");
        const { dispatch, mediator, setSource } = createMediator(services.id);

        const service = mediator as MediatorService;
        service.dispatch = dispatch;
        setSource(services.eventTarget);

        return service;
    },
});
