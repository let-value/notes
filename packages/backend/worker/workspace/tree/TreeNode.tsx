import { ReactiveComponentProperty } from "app/src/utils";
import { PureComponent } from "react";

import { createContext } from "react";
import { BehaviorSubject, combineLatest, filter, firstValueFrom, from, map, mergeMap, switchMap } from "rxjs";
import { WorkspaceStore } from "../WorkspaceStore";
import { WorkspaceNode } from "./WorkspaceNode";

export interface TreeContextProps<TParent extends TreeNode = TreeNode> {
    root: WorkspaceNode;
    store: WorkspaceStore;
    parent: TParent;
}

export const TreeContext = createContext<TreeContextProps>(null);

export class TreeNode<TProps = unknown, TState = unknown> extends PureComponent<TProps, TState> {
    static contextType = TreeContext;
    declare context: TreeContextProps;
    children$ = new BehaviorSubject(new Array<TreeNode>());

    ready$ = new ReactiveComponentProperty(this, (props$) => props$.pipe(map(() => true)));
    get ready() {
        return firstValueFrom(this.ready$.pipeline$.pipe(filter((ready) => ready)));
    }

    deepReady$: ReactiveComponentProperty<TProps, boolean> = new ReactiveComponentProperty(this, (props$) => {
        return props$.pipe(
            mergeMap(() => {
                return combineLatest([
                    this.ready$.pipeline$,
                    this.children$.pipe(
                        switchMap((children) =>
                            combineLatest(
                                children.length
                                    ? Array.from(children).map((child) => child.deepReady$.pipeline$)
                                    : [from([true])],
                            ),
                        ),
                        map((x) => x.reduce((acc, val) => acc && val, true)),
                    ),
                ]).pipe(map(([ready, childrenDeepReady]) => ready && childrenDeepReady));
            }),
        );
    });

    get deepReady() {
        return firstValueFrom(this.deepReady$.pipeline$.pipe(filter((ready) => ready)));
    }

    private disableChildrenRemoval = false;

    freezeChildren() {
        this.disableChildrenRemoval = true;
        firstValueFrom(this.children$).then((children) => children.forEach((child) => child.freezeChildren()));
    }

    addChildren(node: TreeNode) {
        const children = [...this.children$.getValue()];
        children.push(node);
        this.children$.next(children);
    }

    removeChildren(node: TreeNode) {
        if (this.disableChildrenRemoval) {
            return;
        }

        const children = [...this.children$.getValue()];
        const index = children.indexOf(node);
        if (index !== -1) {
            children.splice(index, 1);
        }
        this.children$.next(children);
    }

    componentDidMount() {
        this.context?.parent.addChildren(this);
    }

    componentWillUnmount() {
        this.context?.parent.removeChildren(this);
        this.children$.complete();
    }
}
