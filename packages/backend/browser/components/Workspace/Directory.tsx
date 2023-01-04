import { useAsyncMemo } from "app/src/utils";
import { ItemHandle } from "models";
import { memo, useContext, useMemo } from "react";
import { useBoolean } from "usehooks-ts";
import { File } from "./File";
import { NestedItemsContext, useWorkspaceItem } from "./useWorkspaceItem";
import { WorkspaceContext } from "./WorkspaceContext";

export const Directory = memo(function Directory(item: ItemHandle<true>) {
    const store = useContext(WorkspaceContext);
    const suspended = useBoolean();

    const instance = useMemo(() => ({ suspended }), [suspended]);

    const children = useAsyncMemo(() => store.fs.getDirectoryItems(item), [store], undefined);

    const { treeNode } = useWorkspaceItem(item, instance, children);

    if (!item.isDirectory || suspended.value) {
        return null;
    }

    return (
        <NestedItemsContext.Provider value={treeNode}>
            {children?.map((child) => {
                if (child.isDirectory) {
                    return <Directory key={child.path} {...(child as ItemHandle<true>)} />;
                } else {
                    return <File key={child.path} {...(child as ItemHandle<false>)} />;
                }
            })}
        </NestedItemsContext.Provider>
    );
});
