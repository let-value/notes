/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactiveValue } from "@/utils";
import { Suspense, useEffect, useMemo } from "react";
import { useMap } from "react-use";
import { CallbackInterface, Loadable, RecoilState, RecoilValue, useRecoilCallback } from "recoil";
import { finalize, Observable } from "rxjs";
import { ObserverState } from "./ObserverState";
import { RecoilTunnelObserver } from "./RecoilTunnelObserver";

interface Tunnel {
    getLoadable: <T>(atom: RecoilValue<T>) => Loadable<T>;
    getPromise: <T>(atom: RecoilValue<T>) => Promise<T>;
    set: <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void;
    reset: (atom: RecoilState<any>) => void;
    observe: <T>(atom: RecoilValue<T>) => Observable<T | undefined>;
    action: <T>(action: (methods: CallbackInterface) => T) => T;
}

const tunnel$ = new ReactiveValue<Tunnel>();

let subscribtionCounter = 0;

export function RecoilTunnel() {
    const action = useRecoilCallback<[any], any>(
        (methods) =>
            function <T>(action: (methods: CallbackInterface) => T): T {
                return action(methods);
            },
        [],
    );

    const getLoadable = useRecoilCallback<[atom: RecoilValue<any>], any>(
        ({ snapshot }) =>
            function <T>(atom: RecoilValue<T>) {
                return snapshot.getLoadable(atom);
            },
        [],
    );

    const getPromise = useRecoilCallback<[atom: RecoilValue<any>], Promise<any>>(
        ({ snapshot }) =>
            function <T>(atom: RecoilValue<T>) {
                return snapshot.getPromise(atom);
            },
        [],
    );

    const set = useRecoilCallback(
        ({ set }) =>
            function <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) {
                return set(atom, valOrUpdater);
            },
        [],
    );
    const reset = useRecoilCallback(({ reset }) => reset, []);

    const [observers, actions] = useMap<Record<number, ObserverState>>();

    const observe = useRecoilCallback(
        () =>
            function <T>(atom: RecoilValue<T>) {
                const id = subscribtionCounter++;
                const subject = new ReactiveValue<T>();
                const pipe = subject.pipe(
                    finalize(() => {
                        subject.complete();
                        actions.remove(id);
                    }),
                );
                actions.set(id, { id, atom, subject });
                return pipe;
            },
        [actions],
    );

    const tunnel = useMemo(
        () => ({ action, getLoadable, getPromise, set, reset, observe }),
        [action, getLoadable, getPromise, observe, reset, set],
    );

    useEffect(() => {
        tunnel$.next(tunnel);
    }, [tunnel]);

    return (
        <>
            {Array.from(Object.values(observers)).map((subscribtion) => (
                <Suspense key={subscribtion.id}>
                    <RecoilTunnelObserver {...subscribtion} />
                </Suspense>
            ))}
        </>
    );
}

export async function getRecoilLoadable<T>(atom: RecoilValue<T>): Promise<Loadable<T>> {
    return (await tunnel$.lastValue).getLoadable(atom);
}

export async function getRecoilPromise<T>(atom: RecoilValue<T>): Promise<Promise<T>> {
    return (await tunnel$.lastValue).getPromise(atom);
}

export async function setRecoil<T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) {
    (await tunnel$.lastValue).set(atom, valOrUpdater);
}

export async function resetRecoil(atom: RecoilState<any>) {
    (await tunnel$.lastValue).reset(atom);
}

export async function observeRecoilLoadable<T>(atom: RecoilValue<T>): Promise<Observable<T | undefined>> {
    return (await tunnel$.lastValue).observe(atom);
}

export async function recoilAction<T>(action: (methods: CallbackInterface) => T): Promise<T> {
    return (await tunnel$.lastValue).action(action);
}
