import { BehaviorSubject, filter, fromEvent, map, merge, mergeMap, Subject } from "rxjs";
import { id } from "../tabId";
import { BroadcastMessage } from "./BroadcastMessage";
import { EventTransport } from "./EventTransport";

export const source = new BehaviorSubject<EventTransport | undefined>(undefined);

export const dispatch = new Subject<BroadcastMessage>();

const pipeline = source.pipe(
    filter(Boolean),
    map((broadcastChannel) => fromEvent(broadcastChannel, "message")),
    mergeMap((observable) => observable),
);

export const mediator = merge(dispatch, pipeline).pipe(
    filter((message) => (message.recieverId ? message.recieverId == id : true)),
);

export function setSource(broadcastChannel: EventTransport) {
    source.next(broadcastChannel);
}
