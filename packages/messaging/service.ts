import { createMediator, MediatorFactoryResult } from "./mediator";

export type MediatorService = MediatorFactoryResult["mediator"] & {
    dispatch: MediatorFactoryResult["dispatch"];
    setSource: MediatorFactoryResult["setSource"];
};

export const messagingService = {
    mediator: (): MediatorService => {
        const { dispatch, mediator, setSource } = createMediator();

        const service = mediator as MediatorService;
        service.dispatch = dispatch;
        service.setSource = setSource;

        return service;
    },
};
