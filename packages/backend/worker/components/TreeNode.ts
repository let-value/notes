import { ReactiveMap, ReactiveValue } from "app/src/utils";
import { Item } from "models";

export class TreeNode {
    suspended = new ReactiveValue<boolean>();
    nested = new ReactiveMap<string, TreeNode>();
    constructor(public item: Item, public parent?: TreeNode) {
        parent?.nested.setValue(item.path, this);
    }
}
