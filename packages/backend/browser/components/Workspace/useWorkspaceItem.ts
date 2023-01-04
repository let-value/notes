import { Item } from "models";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useBoolean } from "usehooks-ts";

export interface TreeComponent {
    suspended: ReturnType<typeof useBoolean>;
}

export interface TreeNode {
    root?: TreeNode;
    parent?: TreeNode;
    item: Item;
    component: TreeComponent;
    register: (item: TreeNode) => void;
    unregister: (item: TreeNode) => void;
}

export const NestedItemsContext = createContext<TreeNode>(null);

export function useWorkspaceItem(item: Item, component: TreeComponent) {
    const parent = useContext(NestedItemsContext);
    const root = parent?.root ?? parent;

    const [map] = useState(new Map<string, TreeNode>());

    const register = useCallback(
        (node: TreeNode) => {
            map.set(node.item.path, node);
            root?.register(node);
        },
        [map, root],
    );

    const unregister = useCallback(
        (node: TreeNode) => {
            map.delete(node.item.path);
            root?.unregister(node);
        },
        [map, root],
    );

    const treeNode = useMemo<TreeNode>(
        () => ({ component, item, map, parent, register, root, unregister }),
        [component, item, map, parent, register, root, unregister],
    );

    useEffect(() => {
        const parentNode = parent;
        parentNode?.register(treeNode);
        return () => {
            parentNode?.unregister(treeNode);
        };
    }, [treeNode, item, parent]);

    return { treeNode };
}
