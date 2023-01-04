import { Item } from "models";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useBoolean, useMap } from "usehooks-ts";

export interface TreeComponent {
    suspended: ReturnType<typeof useBoolean>;
}

export interface TreeNode {
    parent?: TreeNode;
    item: Item;
    component: TreeComponent;
    register: (item: TreeNode) => void;
    unregister: (item: TreeNode) => void;
}

export const NestedItemsContext = createContext<TreeNode>(null);

export function useWorkspace(item: Item, component: TreeComponent) {
    const [root, setRoot] = useState<TreeNode>();

    const register = useCallback((node: TreeNode) => {
        setRoot(node);
    }, []);

    const unregister = useCallback(() => {
        setRoot(undefined);
    }, []);

    const treeNode = useMemo<TreeNode>(
        () => ({
            item,
            component,
            register,
            unregister,
        }),
        [component, item, register, unregister],
    );

    return { treeNode };
}

export function useWorkspaceItem(item: Item, component: TreeComponent) {
    const parent = useContext(NestedItemsContext);

    const [map, actions] = useMap<string, TreeNode>();

    const register = useCallback(
        (node: TreeNode) => {
            const path = node.item.path.replace(item.path, "");
            actions.set(path, node);
        },
        [actions, item.path],
    );

    const unregister = useCallback(
        (node: TreeNode) => {
            const path = node.item.path.replace(item.path, "");
            actions.remove(path);
        },
        [actions, item.path],
    );

    const treeNode = useMemo<TreeNode>(
        () => ({ parent, item, component, register, unregister }),
        [component, item, parent, register, unregister],
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
