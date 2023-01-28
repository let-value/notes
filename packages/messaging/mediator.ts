import { BehaviorSubject, filter, fromEvent, merge, Subject, switchMap } from "rxjs";
import { BroadcastMessage } from "./BroadcastMessage";
import { EventTarget } from "./EventTarget";

export function createMediator(recieverId?: string) {
    const source = new BehaviorSubject<EventTarget | undefined>(undefined);
    const dispatcher = new Subject<BroadcastMessage>();
    const pipeline = source.pipe(
        filter(Boolean),
        switchMap((transport) => fromEvent(transport, "message")),
    );

    function dispatch(message: BroadcastMessage) {
        dispatcher.next(message);
    }

    function setSource(broadcastChannel: EventTarget) {
        source.next(broadcastChannel);
    }

    const mediator = merge(dispatcher, pipeline).pipe(
        filter((message) => (message.recieverId && recieverId ? message.recieverId == recieverId : true)),
    );

    return {
        dispatch,
        mediator,
        setSource,
    };
}

export type MediatorFactoryResult = ReturnType<typeof createMediator>;
