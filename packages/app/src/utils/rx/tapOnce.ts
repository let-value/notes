import { defer, Observable, tap } from "rxjs";

export function tapOnce<T>(fn: (payload: T) => void) {
    return (source: Observable<T>) =>
        defer(() => {
            let first = true;
            return source.pipe(
                tap<T>((payload) => {
                    if (first) {
                        fn(payload);
                    }
                    first = false;
                }),
            );
        });
}
