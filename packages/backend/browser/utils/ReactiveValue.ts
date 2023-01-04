import { BehaviorSubject, filter, firstValueFrom } from "rxjs";

export class ReactiveValue<TValue> extends BehaviorSubject<TValue | undefined> {
    constructor(value?: TValue) {
        super(value);
    }
    get lastValue() {
        return firstValueFrom(this.pipe(filter((x) => x !== undefined)));
    }
}
