import { BehaviorSubject } from "rxjs";
import { ReactiveValue } from "./ReactiveValue";

export class ReactiveMap<TKey, TValue> extends Map<TKey, ReactiveValue<TValue>> {
    observable = new BehaviorSubject(this);
    get(key: TKey) {
        let result = super.get(key);
        if (!result) {
            result = new ReactiveValue<TValue>();
            this.set(key, result);
        }
        return result;
    }
    set(key: TKey, value: ReactiveValue<TValue>) {
        super.set(key, value);
        this.observable.next(this);
        return this;
    }
    getValue(key: TKey) {
        return this.get(key).lastValue;
    }
    setValue(key: TKey, value: TValue) {
        this.get(key).next(value);
    }
}
