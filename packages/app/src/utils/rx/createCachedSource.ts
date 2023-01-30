import { defer, first, isObservable, Observable, shareReplay } from "rxjs";
import { of } from "rxjs/internal/observable/of";
import { mergeMap } from "rxjs/internal/operators/mergeMap";

export const createCachedSource = <TValue>(source: Observable<TValue>, bufferSize?: number, windowTime?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let shared$: Observable<TValue>;

    const createShared = (source: Observable<TValue>, bufferSize?: number, windowTime?: number) =>
        (shared$ = source.pipe(shareReplay(bufferSize, windowTime)));

    return createShared(source, bufferSize, windowTime).pipe(
        first(
            null,
            defer(() => createShared(source, bufferSize, windowTime)),
        ),
        mergeMap((d) => (isObservable(d) ? d : of(d))),
    );
};
