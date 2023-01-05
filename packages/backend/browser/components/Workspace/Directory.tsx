import { useAsyncMemo } from "app/src/utils";
import { Item, ItemHandle } from "models";

import { memo, useContext, useEffect, useState } from "react";
import { combineLatest, filter, firstValueFrom, map } from "rxjs";
import { ReactiveValue } from "../../utils/ReactiveValue";
import { useReactiveValue } from "../../utils/useReactiveValue";
import { TreeContext } from "../TreeContext";
import { TreeNode } from "../TreeNode";

import { File } from "./File";

import { WorkspaceContext } from "./WorkspaceContext";

export class TreeDirectoryNode extends TreeNode {
    children = new ReactiveValue<Item[]>();
    get mounted() {
        const childs = this.nested.observable.pipe(map((x) => Array.from(x.values())));
        const pipeline = combineLatest([this.children.valuePipe, childs]).pipe(
            map(([children, values]) => children?.length === values?.filter((x) => x.value).length),
            filter((x) => x === true),
        );

        return firstValueFrom(pipeline);
    }
}

export const Directory = memo(function Directory(item: ItemHandle<true>) {
    const parent = useContext(TreeContext);
    const store = useContext(WorkspaceContext);

    const [instance] = useState(() => new TreeDirectoryNode(item, parent));
    const [suspended] = useReactiveValue(instance.suspended, false);

    const children = useAsyncMemo(() => store.fs.getDirectoryItems(item), [store], undefined);
    useEffect(() => instance.children.next(children), [children, instance]);

    if (!item.isDirectory || suspended) {
        return null;
    }

    console.log(instance);

    return (
        <TreeContext.Provider value={instance}>
            {children?.map((child) => {
                if (child.isDirectory) {
                    return <Directory key={child.path} {...(child as ItemHandle<true>)} />;
                } else {
                    return <File key={child.path} {...(child as ItemHandle<false>)} />;
                }
            })}
        </TreeContext.Provider>
    );
});
