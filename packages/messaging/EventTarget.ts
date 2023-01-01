import { BroadcastMessage } from "./BroadcastMessage";

type EventType = "message";
type MessageHandler = ((this: EventTarget, ev: BroadcastMessage) => unknown) | null;

export type EventTarget = {
    postMessage(msg: BroadcastMessage): Promise<void>;

    onmessage: MessageHandler;

    addEventListener(type: EventType, handler: MessageHandler): void;
    removeEventListener(type: EventType, handler: MessageHandler): void;
};
