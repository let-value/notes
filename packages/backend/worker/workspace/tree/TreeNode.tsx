import { ReactiveComponentProperty, ReactiveValue } from "app/src/utils";
import { PureComponent } from "react";

import { createContext } from "react";
import { BehaviorSubject, combineLatest, filter, firstValueFrom, map, mergeMap, scan } from "rxjs";
import { WorkspaceStore } from "../WorkspaceStore";

export interface TreeContextProps<TParent extends TreeNode = TreeNode> {
    store: WorkspaceStore;
    parent: TParent;
}

export const TreeContext = createContext<TreeContextProps>(null);

export class TreeNode<TProps = unknown, TState = unknown> extends PureComponent<TProps, TState> {
    static contextType = TreeContext;
    declare context: TreeContextProps;
    suspended = new ReactiveValue<boolean>();
    children = new BehaviorSubject(new Set<TreeNode>());

    ready$ = new ReactiveComponentProperty(this, (props$) => props$.pipe(map(() => true)));
    get ready() {
        return firstValueFrom(this.ready$.pipeline$.pipe(filter((ready) => ready)));
    }

    deepReady$: ReactiveComponentProperty<TProps, boolean> = new ReactiveComponentProperty(this, (props$) => {
        return props$.pipe(
            mergeMap(() => {
                return combineLatest([
                    this.ready$.pipeline$,
                    this.children.pipe(
                        mergeMap((children) => Array.from(children).map((child) => child.deepReady$.pipeline$)),
                        mergeMap((x) => x),
                        scan((acc, val) => acc.concat(val), [] as boolean[]),
                    ),
                ]).pipe(map(([ready, childrenDeepReady]) => ready && childrenDeepReady.every((val) => val)));
            }),
        );
    });

    get deepReady() {
        return firstValueFrom(this.deepReady$.pipeline$.pipe(filter((ready) => ready)));
    }

    addChildren(node: TreeNode) {
        const children = new Set(this.children.getValue());
        children.add(node);
        this.children.next(children);
    }

    removeChildren(node: TreeNode) {
        const children = new Set(this.children.getValue());
        children.delete(node);
        this.children.next(children);
    }

    componentDidMount() {
        this.context?.parent.addChildren(this);
    }

    componentWillUnmount() {
        this.context?.parent.removeChildren(this);
    }
}
