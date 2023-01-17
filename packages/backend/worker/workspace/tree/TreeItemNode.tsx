import { ReactiveValue } from "app/src/utils";
import { Component } from "react";

import { createContext } from "react";
import { BehaviorSubject } from "rxjs";
import { WorkspaceStore } from "../WorkspaceStore";

export interface TreeContext {
    store: WorkspaceStore;
    parent: TreeNode;
}

export const TreeContext = createContext<TreeContext>(null);

export class TreeNode<TProps = unknown, TState = unknown> extends Component<TProps, TState> {
    static contextType = TreeContext;
    declare context: React.ContextType<typeof TreeContext>;
    suspended = new ReactiveValue<boolean>();
    children = new BehaviorSubject(new Set<TreeNode>());

    get ready() {
        return Promise.resolve(true);
    }

    componentDidMount() {
        if (!this.context?.parent) {
            return;
        }

        const children = new Set(this.context.parent.children.getValue());
        children.add(this);
        this.context.parent.children.next(children);
    }

    componentWillUnmount() {
        if (!this.context?.parent) {
            return;
        }

        const children = new Set(this.context.parent.children.getValue());
        children.delete(this);
        this.context.parent.children.next(children);
    }
}
