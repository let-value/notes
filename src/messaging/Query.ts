import { v4 as uuidv4 } from "uuid";
import { id } from "../tabId";
import { call, send } from "./broadcast";
import { BroadcastMessage } from "./BroadcastMessage";

export class Query<TResult, TArgs = unknown> {
    constructor(public readonly name: string) {}

    query(args: TArgs, recieverId?: string): BroadcastMessage<"query", TArgs> {
        return {
            name: this.name,
            type: "query",
            correlationId: uuidv4(),
            payload: args,
            recieverId,
            senderId: id,
        };
    }

    selfQuery(args: TArgs, recieverId?: string): BroadcastMessage<"query", TArgs> {
        const query = this.query(args, recieverId);
        query.senderId = "";
        return query;
    }

    response(
        result: TResult,
        query?: BroadcastMessage<"query", TArgs>,
        recieverId?: string,
    ): BroadcastMessage<"response", TResult> {
        return {
            name: this.name,
            type: "response",
            correlationId: query?.correlationId,
            payload: result,
            recieverId,
            senderId: id,
        };
    }

    error(
        result: unknown,
        query?: BroadcastMessage<"query", TArgs>,
        recieverId?: string,
    ): BroadcastMessage<"error", TResult> {
        return {
            name: this.name,
            type: "error",
            correlationId: query?.correlationId,
            payload: result as never,
            recieverId,
            senderId: id,
        };
    }

    respond(query: BroadcastMessage<"query", TArgs>, result: TResult) {
        return send(this.response(result, query, query.senderId));
    }

    respondError(query: BroadcastMessage<"query", TArgs>, result: unknown) {
        return send(this.error(result, query, query.senderId));
    }

    call(args: TArgs, recieverId?: string) {
        return call<TResult, TArgs>(this, args, recieverId);
    }
}
