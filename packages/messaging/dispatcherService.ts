import type { ContextGetter } from "iti/dist/src/_utils";
import { filter, take } from "rxjs";
import { BroadcastMessage } from "./BroadcastMessage";
import { BroadcastMessageType } from "./BroadcastMessageType";
import { EventTarget } from "./EventTarget";
import { MediatorService } from "./messagingService";
import { Query } from "./Query";

export interface DispatcherService {
    send: <TPayload, TType extends BroadcastMessageType>(
        message: BroadcastMessage<TType, TPayload, unknown>,
    ) => Promise<void>;
    call: <TResult, TArgs = void, TMeta = void>(
        method: Query<TResult, TArgs, TMeta>,
        args: TArgs,
        meta?: TMeta | undefined,
        recieverId?: string,
    ) => Promise<TResult>;
}

export const createDispatcherService = (
    services: ContextGetter<{
        id: () => string;
        eventTarget: () => EventTarget;
        mediator: () => MediatorService;
    }>,
) => ({
    dispatcher: (): DispatcherService => {
        const { id, eventTarget, mediator } = services;

        mediator.subscribe((message) => {
            //console.log(id, "recieved", message);
        });

        const send = <TPayload, TType extends BroadcastMessageType>(message: BroadcastMessage<TType, TPayload>) => {
            message.senderId = id;
            //console.log(id, "send", message);
            return eventTarget.postMessage(message);
        };

        const call = <TResult, TArgs = void, TMeta = void>(
            method: Query<TResult, TArgs, TMeta>,
            args: TArgs,
            meta?: TMeta,
            recieverId?: string,
        ): Promise<TResult> =>
            new Promise((resolve, reject) => {
                const query = method.query(args, meta, recieverId);
                query.senderId = id;

                mediator
                    .pipe(
                        filter((message) => message.correlationId === query.correlationId),
                        take(1),
                    )
                    .subscribe((message: BroadcastMessage) => {
                        if (message.type === "error") {
                            reject(message.payload);
                            return;
                        }

                        resolve(message.payload as TResult);
                    });

                send(query);
            });

        return {
            call,
            send,
        };
    },
});
