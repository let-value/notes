import { filter, take } from "rxjs";
import { BroadcastMessage } from "./BroadcastMessage";
import { BroadcastMessageType } from "./BroadcastMessageType";
import { mediator, source } from "./mediator";
import { Query } from "./Query";

export const send = <TPayload, TType extends BroadcastMessageType>(message: BroadcastMessage<TType, TPayload>) => {
    return source.pipe(take(1)).subscribe((channel) => channel?.postMessage(message));
};

mediator.subscribe(() => {
    //a
});

export const call = <TResult, TArgs = void, TMeta = void>(
    method: Query<TResult, TArgs, TMeta>,
    args: TArgs,
    meta?: TMeta,
    recieverId?: string,
): Promise<TResult> =>
    new Promise((resolve, reject) => {
        const query = method.query(args, meta, recieverId);

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
