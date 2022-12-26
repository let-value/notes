import { BroadcastMessageType } from "./BroadcastMessageType";

export interface BroadcastMessage<TType extends BroadcastMessageType = BroadcastMessageType> {
    name: string;
    type: TType;
    key?: string;
    payload: unknown;
    workerId?: string;
}
