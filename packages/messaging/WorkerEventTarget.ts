import { BroadcastMessage } from "./BroadcastMessage";
import { BroadcastMessageType } from "./BroadcastMessageType";
import { EventTarget } from "./EventTarget";

const listeners = new Map();

interface WorkerLike {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postMessage: (message: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onmessage: ((this: any, ev: MessageEvent<any>) => any) | null;
    addEventListener: Worker["addEventListener"];
    removeEventListener: Worker["removeEventListener"];
}

export class WorkerEventTarget implements EventTarget {
    constructor(private worker: WorkerLike) {}
    async postMessage(msg: BroadcastMessage<BroadcastMessageType, unknown, unknown>): Promise<void> {
        return this.worker.postMessage(msg);
    }
    set onmessage(
        handler: (this: EventTarget, ev: BroadcastMessage<BroadcastMessageType, unknown, unknown>) => unknown,
    ) {
        this.worker.onmessage = function (message) {
            handler.call(this, message.data);
        };
    }
    addEventListener(
        type: "message",
        handler: ((this: EventTarget, ev: BroadcastMessage<BroadcastMessageType, unknown, unknown>) => unknown) | null,
    ): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrapper = (message: any) => {
            handler?.call(this, message.data);
        };
        listeners.set(handler, wrapper);
        this.worker.addEventListener(type, wrapper);
    }
    removeEventListener(
        type: "message",
        handler: ((this: EventTarget, ev: BroadcastMessage<BroadcastMessageType, unknown, unknown>) => unknown) | null,
    ): void {
        const wrapper = listeners.get(handler);
        if (wrapper) {
            this.worker.removeEventListener(type, wrapper);
            listeners.delete(handler);
        }
    }
}
