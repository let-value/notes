import { v4 as uuidv4 } from "uuid";
import { BroadcastMessage } from "../broadcast";

export class ApiMethod<TResult, TArgs = void> {
    constructor(public readonly name: string) {}

    request(args: TArgs, workerId?: string): BroadcastMessage<"request"> {
        return {
            name: this.name,
            type: "request",
            key: uuidv4(),
            payload: args,
            workerId,
        };
    }

    response(result: TResult, request?: BroadcastMessage<"request">, workerId?: string): BroadcastMessage<"response"> {
        return {
            name: this.name,
            type: "response",
            key: request?.key,
            payload: result,
            workerId,
        };
    }
}
