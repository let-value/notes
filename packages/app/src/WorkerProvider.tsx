import { Pane, Spinner } from "evergreen-ui";
import { FC, PropsWithChildren } from "react";
import { useRecoilValueLoadable } from "recoil";
import { workerState } from "./atom/workerState";

export const WorkerProvider: FC<PropsWithChildren> = ({ children }) => {
    const worker = useRecoilValueLoadable(workerState);

    if (worker.state != "hasValue") {
        return (
            <Pane display="flex" alignItems="center" justifyContent="center" height="100%" width="100%">
                <Spinner />
            </Pane>
        );
    }

    return <>{children}</>;
};
