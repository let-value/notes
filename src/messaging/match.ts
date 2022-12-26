import { filter, map, Observable } from "rxjs";
import { BroadcastMessage } from "./BroadcastMessage";
import { Query } from "./Query";

export function matchQuery<T extends BroadcastMessage, TResult, TArgs>(query: Query<TResult, TArgs>) {
    return (source: Observable<T>) =>
        source.pipe(
            filter<T>((x) => x.type == "query" && x.name == query.name),
            map((x) => x as BroadcastMessage<"query", TArgs>),
        );
}

export function matchResponse<T extends BroadcastMessage, TResult>(query: Query<TResult>) {
    return (source: Observable<T>) =>
        source.pipe(
            filter<T>((x) => x.type == "response" && x.name == query.name),
            map((x) => x as BroadcastMessage<"response", TResult>),
        );
}
