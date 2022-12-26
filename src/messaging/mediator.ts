import { BroadcastChannel } from "broadcast-channel";
import { BehaviorSubject, filter, fromEvent, map, merge, mergeMap, Subject } from "rxjs";
import { id } from "../tabId";
import { BroadcastMessage } from "./BroadcastMessage";

export const source = new BehaviorSubject<BroadcastChannel<BroadcastMessage> | undefined>(undefined);

export const dispatch = new Subject<BroadcastMessage>();

const waterfall = source.pipe(
    filter(Boolean),
    map((broadcastChannel) => fromEvent(broadcastChannel, "message")),
    mergeMap((observable) => observable),
);

export const mediator = merge(dispatch, waterfall).pipe(
    filter((message) => (message.recieverId ? message.recieverId == id : true)),
);

export function setSource(broadcastChannel: BroadcastChannel<BroadcastMessage>) {
    source.next(broadcastChannel);
}
