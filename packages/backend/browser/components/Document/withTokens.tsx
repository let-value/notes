import { useAsyncMemo } from "app/src/utils";
import { FC, useContext, useMemo } from "react";
import { getLanguage } from "../../utils/getLanguage";
import { WorkspaceContext } from "../Workspace/WorkspaceContext";
import { FilePropsWithTokens } from "./FileComponentProps";

export function withTokens<TProps extends FilePropsWithTokens>(WrappedComponent: FC<TProps>) {
    return function WithSubscription(item: TProps) {
        const store = useContext(WorkspaceContext);
        const language = useMemo(() => getLanguage(item), [item]);
        const tokens = useAsyncMemo(() => store.parse.getTokens(item, language), [item, language, store.parse]);

        return <WrappedComponent {...item} language={language} tokens={tokens} />;
    };
}
