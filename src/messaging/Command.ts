import { id } from "../tabId";
import { BroadcastMessage } from "./BroadcastMessage";

export class Command<TPayload, TMeta = unknown> {
    constructor(public readonly name: string) {}
    action(payload: TPayload, meta: TMeta, recieverId?: string): BroadcastMessage<"command", TPayload, TMeta> {
        return {
            name: this.name,
            type: "command",
            payload,
            meta,
            senderId: id,
            recieverId,
        };
    }
}
