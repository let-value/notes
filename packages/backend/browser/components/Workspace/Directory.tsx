import { useAsyncMemo } from "app/src/utils";
import { ItemHandle } from "models";
import { memo, useContext, useMemo } from "react";
import { useBoolean } from "usehooks-ts";
import { File } from "./File";
import { NestedItemsContext, useWorkspaceItem } from "./useWorkspaceItem";
import { WorkspaceContext } from "./WorkspaceContext";

interface DirectoryProps {
    item: ItemHandle<true>;
}

export const Directory = memo(function Directory({ item }: DirectoryProps) {
    const store = useContext(WorkspaceContext);
    const suspended = useBoolean();

    const instance = useMemo(() => ({ suspended }), [suspended]);
    const { treeNode } = useWorkspaceItem(item, instance);

    const root = useAsyncMemo(() => store.fs.getDirectoryItems(item), [store], undefined);

    if (!item.isDirectory || suspended.value) {
        return null;
    }

    return (
        <NestedItemsContext.Provider value={treeNode}>
            {root.map((child) => {
                if (child.isDirectory) {
                    return <Directory key={child.path} item={child} />;
                } else {
                    return <File key={child.path} item={child} />;
                }
            })}
        </NestedItemsContext.Provider>
    );
});
