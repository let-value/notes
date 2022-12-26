import { BroadcastChannel } from "broadcast-channel";
import { BehaviorSubject, filter, fromEvent, map, mergeMap } from "rxjs";
import { id } from "../tabId";
import { BroadcastMessage } from "./BroadcastMessage";

export const source = new BehaviorSubject<BroadcastChannel<BroadcastMessage> | undefined>(undefined);

export const mediator = source.pipe(
    filter(Boolean),
    map((broadcastChannel) => fromEvent(broadcastChannel, "message")),
    mergeMap((observable) => observable),
    filter((message) => (message.recieverId ? message.recieverId == id : true)),
);

export function setSource(broadcastChannel: BroadcastChannel<BroadcastMessage>) {
    source.next(broadcastChannel);
}
