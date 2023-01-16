import { FC, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ObserverState } from "./ObserverState";

export const RecoilTunnelObserver: FC<ObserverState> = ({ atom, subject }) => {
    const loadable = useRecoilValue(atom);

    useEffect(() => {
        subject.next(loadable);
    }, [loadable, subject]);

    return null;
};
