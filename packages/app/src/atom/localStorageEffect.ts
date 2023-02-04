import { AtomEffect } from "recoil";

export const localStorageEffect =
    <TValue, TObject>(
        key: string,
        stringify: (value: TValue) => TObject = (a) => a as never,
        parse: (value: TObject) => TValue = (a) => a as never,
    ): AtomEffect<TValue> =>
    ({ setSelf, onSet }) => {
        const savedValue = localStorage.getItem(key);
        if (savedValue != null) {
            setSelf(parse(JSON.parse(savedValue)));
        }

        onSet((newValue, _, isReset) => {
            isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(stringify(newValue)));
        });
    };
