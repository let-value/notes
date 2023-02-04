import { Spinner } from "@blueprintjs/core";
import { FC, PropsWithChildren } from "react";
import { useRecoilValue } from "recoil";
import { workerState } from "./atom/workerState";

export const WorkerProvider: FC<PropsWithChildren> = ({ children }) => {
    const worker = useRecoilValue(workerState);

    if (worker === undefined) {
        return (
            <div className="flex align-middle justify-center h-full w-full">
                <Spinner />
            </div>
        );
    }

    return <>{children}</>;
};
