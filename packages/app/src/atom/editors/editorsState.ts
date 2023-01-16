import { Item } from "models";
import { editor } from "monaco-editor";
import { atomFamily, selectorFamily, useRecoilCallback } from "recoil";

type Param = Readonly<Item["path"]>;

export const editorsState = atomFamily({
    key: "editors",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    default: (_: Param) => new Set<editor.IStandaloneCodeEditor>(),
});

export const useRegisterEditor = (item: Param) =>
    useRecoilCallback(
        ({ set }) =>
            (instance: editor.IStandaloneCodeEditor) => {
                set(editorsState(item), (prev) => {
                    const next = new Set(prev);
                    next.add(instance);
                    return next;
                });
            },
        [item],
    );

export const useUnregisterEditor = (item: Param) =>
    useRecoilCallback(
        ({ set, snapshot }) =>
            (instance: editor.IStandaloneCodeEditor) => {
                const loadable = snapshot.getLoadable(editorsState(item));
                if (loadable.state !== "hasValue") {
                    return;
                }

                const next = new Set(loadable.contents);
                next.delete(instance);

                set(editorsState(item), next);

                return next;
            },
        [item],
    );

export const registeredEditorsSelector = selectorFamily({
    key: "editors/registered",
    get:
        (item: Param) =>
        ({ get }) =>
            get(editorsState(item)),
});

export const isLastEditorSelector = selectorFamily({
    key: "editors/last",
    get:
        (item: Param) =>
        ({ get }) =>
            get(registeredEditorsSelector(item)).size === 1,
});
