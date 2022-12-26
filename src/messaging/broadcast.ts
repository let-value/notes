import { filter, take } from "rxjs";
import { id } from "../tabId";
import { BroadcastMessage } from "./BroadcastMessage";
import { BroadcastMessageType } from "./BroadcastMessageType";
import { createBroadcastChannel } from "./createBroadcastChannel";
import { mediator, setSource } from "./mediator";
import { Query } from "./Query";

export const broadcastChannel = createBroadcastChannel();
setSource(broadcastChannel);

export const send = <TPayload, TType extends BroadcastMessageType>(message: BroadcastMessage<TType, TPayload>) => {
    console.log("send", message);
    return broadcastChannel.postMessage(message);
};

mediator.subscribe((message) => {
    console.log("recieved", id, message);
});

export const call = <TResult, TArgs = void>(
    method: Query<TResult, TArgs>,
    args: TArgs,
    recieverId?: string,
): Promise<TResult> =>
    new Promise((resolve, reject) => {
        const query = method.query(args, recieverId);

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
