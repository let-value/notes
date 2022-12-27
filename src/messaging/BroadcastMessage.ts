import { BroadcastMessageType } from "./BroadcastMessageType";

export interface BroadcastMessage<
    TType extends BroadcastMessageType = BroadcastMessageType,
    TPayload = unknown,
    TMeta = unknown,
> {
    name: string;
    type: TType;
    correlationId?: string;
    payload: TPayload;
    meta: TMeta;
    senderId: string;
    recieverId?: string;
}
