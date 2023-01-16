import { FC, useEffect } from "react";
import { useRecoilValueLoadable } from "recoil";
import { ObserverState } from "./ObserverState";

export const RecoilTunnelObserver: FC<ObserverState> = ({ atom, subject }) => {
    const loadable = useRecoilValueLoadable(atom);

    useEffect(() => {
        subject.next(loadable);
    }, [loadable, subject]);

    return null;
};
