import { BehaviorSubject, filter, firstValueFrom } from "rxjs";

export class ReactiveValue<TValue> extends BehaviorSubject<TValue | undefined> {
    constructor(value?: TValue) {
        super(value);
    }
    get valuePipe() {
        return this.pipe(filter((x): x is TValue => x !== undefined));
    }
    get lastValue() {
        return firstValueFrom(this.valuePipe);
    }
}
