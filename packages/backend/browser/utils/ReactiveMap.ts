import { ReactiveValue } from "./ReactiveValue";

export class ReactiveMap<TKey, TValue> extends Map<TKey, ReactiveValue<TValue>> {
    get(key: TKey) {
        let result = super.get(key);
        if (!result) {
            result = new ReactiveValue<TValue>();
            this.set(key, result);
        }
        return result;
    }
    getValue(key: TKey) {
        return this.get(key).lastValue;
    }
    setValue(key: TKey, value: TValue) {
        this.get(key).next(value);
    }
}
