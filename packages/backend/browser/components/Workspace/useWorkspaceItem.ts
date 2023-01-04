import { Item } from "models";
import { createContext, useContext, useEffect, useState } from "react";
import { useBoolean } from "usehooks-ts";
import { ReactiveMap } from "../../utils/ReactiveMap";
import { ReactiveValue } from "../../utils/ReactiveValue";

export interface TreeComponent {
    suspended: ReturnType<typeof useBoolean>;
}

export class TreeNode {
    component = new ReactiveValue<TreeComponent>();
    children = new ReactiveValue<Item[]>();
    nested = new ReactiveMap<string, TreeNode>();
    constructor(public item: Item, public parent?: TreeNode, public root?: TreeNode) {}
    static getNested(ctx: TreeNode, path: string) {
        return ctx.nested.get(path).lastValue;
    }

    static register(ctx: TreeNode, item: TreeNode) {
        if (!ctx) {
            return;
        }
        ctx.nested.setValue(item.item.path, item);
        if (ctx.root) {
            TreeNode.register(ctx.root, item);
        }
    }

    static unregister(ctx: TreeNode, item: TreeNode) {
        if (!ctx) {
            return;
        }
        ctx.nested.setValue(item.item.path, undefined);
        if (ctx.root) {
            TreeNode.unregister(ctx.root, item);
        }
    }
}

export const NestedItemsContext = createContext<TreeNode>(null);

export function useWorkspaceItem(item: Item, component: TreeComponent, children?: Item[]) {
    const parent = useContext(NestedItemsContext);
    const root = parent?.root ?? parent;

    const [treeNode] = useState(() => new TreeNode(item, parent, root));

    useEffect(() => {
        treeNode.component.next(component);
    }, [component, treeNode.component]);

    useEffect(() => {
        treeNode.children.next(children);
    }, [children, treeNode.children]);

    useEffect(() => {
        const parentNode = parent;
        TreeNode.register(parentNode, treeNode);
        return () => {
            TreeNode.unregister(parentNode, treeNode);
        };
    }, [treeNode, parent]);

    return { treeNode };
}
