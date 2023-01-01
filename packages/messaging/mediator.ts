import { BehaviorSubject, filter, fromEvent, map, merge, mergeMap, Subject } from "rxjs";
import { BroadcastMessage } from "./BroadcastMessage";
import { EventTransport } from "./EventTransport";

export function createMediator() {
    const source = new BehaviorSubject<EventTransport | undefined>(undefined);
    const dispatch = new Subject<BroadcastMessage>();
    const pipeline = source.pipe(
        filter(Boolean),
        map((transport) => fromEvent(transport, "message")),
        mergeMap((observable) => observable),
    );

    function setSource(broadcastChannel: EventTransport) {
        source.next(broadcastChannel);
    }

    const mediator = merge(dispatch, pipeline);
    return {
        dispatch,
        mediator,
        setSource,
    };
}

export type MediatorFactoryResult = ReturnType<typeof createMediator>;

export const { dispatch, mediator, setSource } = createMediator();
// .pipe(
//     filter((message) => (message.recieverId ? message.recieverId == id : true)),
// );
