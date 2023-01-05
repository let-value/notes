import { Item } from "models";
import { ReactiveMap } from "../utils/ReactiveMap";
import { ReactiveValue } from "../utils/ReactiveValue";

export class TreeNode {
    suspended = new ReactiveValue<boolean>();
    nested = new ReactiveMap<string, TreeNode>();
    constructor(public item: Item, public parent?: TreeNode) {
        parent?.nested.setValue(item.path, this);
    }
}
