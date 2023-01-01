import { v4 as uuidv4 } from "uuid";
import { id } from "../tabId";
import { call, send } from "./broadcast";
import { BroadcastMessage } from "./BroadcastMessage";

export class Query<TResult, TArgs = unknown, TMeta = unknown> {
    constructor(public readonly name: string) {}

    query(args: TArgs, meta?: TMeta, recieverId?: string): BroadcastMessage<"query", TArgs, TMeta> {
        return {
            name: this.name,
            type: "query",
            correlationId: uuidv4(),
            payload: args,
            meta,
            recieverId,
            senderId: id,
        };
    }

    selfQuery(args: TArgs, meta?: TMeta, recieverId?: string): BroadcastMessage<"query", TArgs, TMeta> {
        const query = this.query(args, meta, recieverId);
        query.senderId = "";
        return query;
    }

    response(
        result: TResult,
        query?: BroadcastMessage<"query", TArgs>,
        meta?: TMeta,
        recieverId?: string,
    ): BroadcastMessage<"response", TResult> {
        return {
            name: this.name,
            type: "response",
            correlationId: query?.correlationId,
            payload: result,
            meta,
            recieverId,
            senderId: id,
        };
    }

    error(
        result: unknown,
        query?: BroadcastMessage<"query", TArgs>,
        meta?: TMeta,
        recieverId?: string,
    ): BroadcastMessage<"error", TResult> {
        return {
            name: this.name,
            type: "error",
            correlationId: query?.correlationId,
            payload: result as never,
            meta,
            recieverId,
            senderId: id,
        };
    }

    respond(query: BroadcastMessage<"query", TArgs>, result: TResult, meta?: TMeta) {
        return send(this.response(result, query, meta, query.senderId));
    }

    respondError(query: BroadcastMessage<"query", TArgs>, result: unknown, meta?: TMeta) {
        return send(this.error(result, query, meta, query.senderId));
    }

    call(args: TArgs, meta?: TMeta, recieverId?: string) {
        return call<TResult, TArgs, TMeta>(this, args, meta, recieverId);
    }
}
