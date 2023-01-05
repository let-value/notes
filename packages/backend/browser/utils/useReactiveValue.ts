import { useObservableState } from "observable-hooks";
import { useCallback } from "react";
import { ReactiveValue } from "./ReactiveValue";

export function useReactiveValue<TValue>(reactiveValue: ReactiveValue<TValue>, initialState?: TValue | (() => TValue)) {
    const value = useObservableState(reactiveValue, initialState);

    const setValue = useCallback(
        (value: TValue) => {
            reactiveValue.next(value);
        },
        [reactiveValue],
    );

    return [value, setValue] as const;
}
