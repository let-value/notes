import { Spinner } from "@blueprintjs/core";
import { ComponentType, FC, ReactNode, Suspense } from "react";

export function withSuspense<TProps>(WrappedComponent: ComponentType<TProps>, FallbackComponent: ReactNode = null) {
    const SuspenseHOC: FC<TProps> = (props) => {
        return (
            <Suspense fallback={FallbackComponent ?? <Spinner />}>
                <WrappedComponent {...props} />
            </Suspense>
        );
    };

    return SuspenseHOC;
}
