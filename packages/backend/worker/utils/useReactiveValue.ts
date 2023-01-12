import { ReactiveValue } from "app/src/utils";
import { useObservableState } from "observable-hooks";
import { useCallback } from "react";

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
