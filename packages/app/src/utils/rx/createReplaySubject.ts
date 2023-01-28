import { Observable, ReplaySubject } from "rxjs";

export function createReplaySubject<T>(
    source: Observable<T>,
    ...args: ConstructorParameters<typeof ReplaySubject>
): ReplaySubject<T> {
    const subject = new ReplaySubject<T>(...args);
    const subscription = source.subscribe(subject);
    const base = subject.complete;
    subject.complete = () => {
        subscription.unsubscribe();
        base.apply(subject);
    };
    return subject;
}
