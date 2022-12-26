import { AtomEffect } from "recoil";
import { ApiMethod } from "../backend/ApiMethod";
import { BroadcastMessage } from "../broadcast";
import { broadcast } from "../broadcastChannel";

export const createBroadcastEffect =
    <T>(method: ApiMethod<T>): AtomEffect<T> =>
    ({ setSelf }) => {
        function listener(event: BroadcastMessage) {
            console.log("createBroadcastEffect: ", event);
            if (event.name === method.name && event.type === "response") {
                setSelf(event.payload as T);
            }
        }

        console.log("subscrubed", method.name);
        broadcast.channel.addEventListener("message", listener);

        return () => {
            console.log("unsubscrubed", method.name);
            broadcast.channel.removeEventListener("message", listener);
        };
    };
