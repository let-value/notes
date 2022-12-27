import { BroadcastMessage } from "./BroadcastMessage";

type EventType = "message";
type MessageHandler = ((this: EventTransport, ev: BroadcastMessage) => unknown) | null;

export type EventTransport = {
    readonly name: string;
    readonly isClosed: boolean;

    postMessage(msg: BroadcastMessage): Promise<void>;
    close(): Promise<void>;

    onmessage: MessageHandler;

    addEventListener(type: EventType, handler: MessageHandler): void;
    removeEventListener(type: EventType, handler: MessageHandler): void;
};
