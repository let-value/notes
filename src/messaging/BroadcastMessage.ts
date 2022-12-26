import { BroadcastMessageType } from "./BroadcastMessageType";

export interface BroadcastMessage<TType extends BroadcastMessageType = BroadcastMessageType, TPayload = unknown> {
    name: string;
    type: TType;
    correlationId?: string;
    payload: TPayload;
    senderId: string;
    recieverId?: string;
}
