import { ItemHandle } from "models";
import { memo, useMemo } from "react";
import { useBoolean } from "usehooks-ts";
import { getLanguage } from "../../utils/getLanguage";
import { fileComponent } from "../Document";
import { NestedItemsContext, useWorkspaceItem } from "./useWorkspaceItem";

export const File = memo(function File(item: ItemHandle<false>) {
    const suspended = useBoolean();
    const language = useMemo(() => getLanguage(item), [item]);
    const instance = useMemo(() => ({ suspended }), [suspended]);

    const { treeNode } = useWorkspaceItem(item, instance);

    const Component = fileComponent[language];

    if (!Component) {
        return null;
    }

    return (
        <NestedItemsContext.Provider value={treeNode}>
            <Component {...item} language={language} />
        </NestedItemsContext.Provider>
    );
});
