import { Spinner } from "@blueprintjs/core";
import { FC, PropsWithChildren } from "react";
import { useRecoilValueLoadable } from "recoil";
import { workerState } from "./atom/workerState";

export const WorkerProvider: FC<PropsWithChildren> = ({ children }) => {
    const worker = useRecoilValueLoadable(workerState);

    if (worker.state != "hasValue") {
        return (
            <div className="flex align-middle justify-center h-full w-full">
                <Spinner />
            </div>
        );
    }

    return <>{children}</>;
};
