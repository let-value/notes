/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactiveValue } from "@/utils";
import { useEffect, useMemo } from "react";
import { Loadable, RecoilState, RecoilValue, useRecoilCallback } from "recoil";
import { BehaviorSubject, finalize, Observable } from "rxjs";
import { useMap } from "usehooks-ts";
import { ObserverState } from "./ObserverState";
import { RecoilTunnelObserver } from "./RecoilTunnelObserver";

interface Tunnel {
    getLoadable: <T>(atom: RecoilValue<T>) => Loadable<T>;
    getPromise: <T>(atom: RecoilValue<T>) => Promise<T>;
    set: <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void;
    reset: (atom: RecoilState<any>) => void;
    observe: <T>(atom: RecoilValue<T>) => Observable<Loadable<T>>;
}

const tunnel$ = new ReactiveValue<Tunnel>();

let subscribtionCounter = 0;

export function RecoilTunnel() {
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

    const [observers, actions] = useMap<number, ObserverState>([]);

    const observe = useRecoilCallback(
        ({ snapshot }) =>
            function <T>(atom: RecoilValue<T>) {
                const id = subscribtionCounter++;
                const subject = new BehaviorSubject<Loadable<T>>(snapshot.getLoadable(atom));
                const pipe = subject.pipe(
                    finalize(() => {
                        console.log("finalize", id);
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
        () => ({ getLoadable, getPromise, set, reset, observe }),
        [getLoadable, getPromise, observe, reset, set],
    );

    useEffect(() => {
        tunnel$.next(tunnel);
    }, [tunnel]);

    return (
        <>
            {Array.from(observers.values()).map((subscribtion) => (
                <RecoilTunnelObserver key={subscribtion.id} {...subscribtion} />
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

export async function observeRecoilLoadable<T>(atom: RecoilValue<T>): Promise<Observable<Loadable<T>>> {
    return (await tunnel$.lastValue).observe(atom);
}
