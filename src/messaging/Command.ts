import { id } from "../tabId";
import { BroadcastMessage } from "./BroadcastMessage";

export class Command<TPayload> {
    constructor(public readonly name: string) {}
    action(payload: TPayload, recieverId?: string): BroadcastMessage<"command", TPayload> {
        return {
            name: this.name,
            type: "command",
            payload,
            senderId: id,
            recieverId,
        };
    }
}
