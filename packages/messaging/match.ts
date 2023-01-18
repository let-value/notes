import { filter, map, Observable } from "rxjs";
import { BroadcastMessage } from "./BroadcastMessage";
import { Command } from "./Command";
import { Query } from "./Query";

export function matchQuery<T extends BroadcastMessage, TPayload, TArgs>(query: Query<TPayload, TArgs>) {
    return (source: Observable<T>) =>
        source.pipe(
            filter<T>((x) => x.type == "query" && x.name == query.name),
            map((x) => x as BroadcastMessage<"query", TArgs>),
        );
}

export function matchResponse<T extends BroadcastMessage, TPayload, TArgs, TMeta>(
    query: Query<TPayload, TArgs, TMeta>,
) {
    return (source: Observable<T>) =>
        source.pipe(
            filter<T>((x) => x.type == "response" && x.name == query.name),
            map((x) => x as BroadcastMessage<"response", TPayload, TMeta>),
        );
}

export function matchCommand<T extends BroadcastMessage, TResult>(command: Command<TResult>) {
    return (source: Observable<T>) =>
        source.pipe(
            filter<T>((x) => x.type == "command" && x.name == command.name),
            map((x) => x as BroadcastMessage<"command", TResult>),
        );
}
