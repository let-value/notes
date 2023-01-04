import { useAsyncMemo } from "app/src/utils";
import { Item } from "models";
import { memo, useContext, useMemo } from "react";
import { useBoolean } from "usehooks-ts";
import { getLanguage } from "../../utils/getLanguage";
import { fileComponent } from "../Document";
import { useWorkspaceItem } from "./useWorkspaceItem";
import { WorkspaceContext } from "./WorkspaceContext";

export interface FileProps {
    item: Item<false>;
}

export const File = memo(function File({ item }: FileProps) {
    const suspended = useBoolean();
    const store = useContext(WorkspaceContext);
    const language = useMemo(() => getLanguage(item), [item]);
    const tokens = useAsyncMemo(() => store.parse.getTokens(item, language), [item, language, store.parse]);
    const instance = useMemo(() => ({ suspended, language, tokens }), [language, suspended, tokens]);

    useWorkspaceItem(item, instance);

    const Component = fileComponent[language];

    if (!Component) {
        return null;
    }

    return <Component item={item} />;
});
