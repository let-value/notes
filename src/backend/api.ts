import { BroadcastMessage } from "../broadcast";
import { broadcast } from "../broadcastChannel";
import { ApiMethod } from "./ApiMethod";

export const call = <TResult, TArgs = void>(
    method: ApiMethod<TResult, TArgs>,
    args: TArgs,
    workerId?: string,
): Promise<TResult> =>
    new Promise((resolve) => {
        const request = method.request(args, workerId);
        const listener = (message: BroadcastMessage) => {
            if (message.type == "response" && message.key === request.key) {
                broadcast.channel.removeEventListener("message", listener);
                console.log("Received response", message);
                resolve(message.payload as TResult);
            }
        };
        broadcast.channel.addEventListener("message", listener);
        console.log("Sending request", request);
        broadcast.channel.postMessage(request);
    });
