import { Observable, ReplaySubject, shareReplay } from "rxjs";

export function createReplaySubject<T>(
    source: Observable<T>,
    ...args: Parameters<typeof shareReplay>
): ReplaySubject<T> {
    const result = source.pipe(shareReplay(...args));
    return result as unknown as ReplaySubject<T>;
}

// export function createReplaySubject<T>(
//     source: Observable<T>,
//     ...args: ConstructorParameters<typeof ReplaySubject>
// ): ReplaySubject<T> {
//     const subject = new ReplaySubject<T>(...args);

//     const subscription = defer(() => of(source))
//         .pipe(switchMap((x) => x))
//         .subscribe(subject);

//     const base = subject.complete;
//     subject.complete = () => {
//         subscription.unsubscribe();
//         base.apply(subject);
//     };
//     return subject;
// }
