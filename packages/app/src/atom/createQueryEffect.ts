import { BroadcastMessage, Command, matchCommand, matchResponse, Query } from "messaging";
import { AtomEffect } from "recoil";
import { filter } from "rxjs";
import { context } from "./storeServices";

export const createQueryEffect =
    <TPayload, TArgs, TMeta>(
        query: Query<TPayload, TArgs, TMeta>,
        predicate?: Parameters<typeof filter<BroadcastMessage<"response", TPayload, TMeta>>>[0],
    ): AtomEffect<TPayload> =>
    ({ setSelf }) => {
        let pipeline = context.mediator.pipe(matchResponse(query));

        if (predicate) {
            pipeline = pipeline.pipe(filter(predicate));
        }

        const subscription = pipeline.subscribe((event) => {
            setSelf(event.payload);
        });

        return () => {
            subscription.unsubscribe();
        };
    };

export const createCommandEffect =
    <T>(command: Command<T>, predicate?: Parameters<typeof filter<BroadcastMessage<"command", T>>>[0]): AtomEffect<T> =>
    ({ setSelf }) => {
        let pipeline = context.mediator.pipe(matchCommand(command));

        if (predicate) {
            pipeline = pipeline.pipe(filter(predicate));
        }

        const subscription = pipeline.subscribe((event) => {
            setSelf(event.payload);
        });

        return () => {
            subscription.unsubscribe();
        };
    };
