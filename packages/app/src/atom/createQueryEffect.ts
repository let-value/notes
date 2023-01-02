import { container } from "@/container";
import { BroadcastMessage, Command, matchCommand, matchResponse, Query } from "messaging";
import { AtomEffect } from "recoil";
import { filter } from "rxjs";

const mediator = container.get("mediator");

export const createQueryEffect =
    <T>(query: Query<T>, predicate?: Parameters<typeof filter<BroadcastMessage<"response", T>>>[0]): AtomEffect<T> =>
    ({ setSelf }) => {
        let pipeline = mediator.pipe(matchResponse(query));

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
        let pipeline = mediator.pipe(matchCommand(command));

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
