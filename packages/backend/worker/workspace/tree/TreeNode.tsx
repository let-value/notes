import { createReplaySubject } from "app/src/utils";
import { PureComponent } from "react";

import { createContext } from "react";
import {
    BehaviorSubject,
    combineLatest,
    defer,
    delay,
    filter,
    firstValueFrom,
    map,
    Observable,
    shareReplay,
    startWith,
    Subject,
    switchMap,
} from "rxjs";
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

    ready$: Subject<boolean> = new BehaviorSubject(true);
    get ready() {
        return firstValueFrom(this.ready$.pipe(filter((ready) => ready)));
    }

    deepReady$: Subject<boolean> = createReplaySubject(
        this.children$.pipe(
            delay(0),
            switchMap((children) => combineLatest([this.ready$, ...children.map((child) => child.deepReady$)])),
            map((ready) => ready.every((ready) => ready === true)),
        ),
        1,
    );

    // progressSubscription = this.deepReady$.subscribe((deepReady) => {
    //     console.log("deepReady", this, deepReady);
    // });

    get deepReady() {
        return firstValueFrom(this.deepReady$.pipe(filter((ready) => ready)));
    }

    progress$: Observable<[number, number]> = defer(() =>
        combineLatest([
            this.children$.pipe(
                switchMap((children) => combineLatest(children.map((child) => child.ready$))),
                startWith([] as boolean[]),
                map((statuses) => statuses.filter((status) => status).length),
            ),
            this.children$.pipe(
                map((x) => x.length),
                startWith(0),
            ),
            this.children$.pipe(
                switchMap((children) => combineLatest(children.map((child) => child.progress$))),
                map((statuses) =>
                    statuses.reduce(
                        ([readyAcc, countAcc], [readyChild, countChild]) => [
                            readyAcc + readyChild,
                            countAcc + countChild,
                        ],
                        [0, 0],
                    ),
                ),
                startWith([0, 0]),
            ),
        ]).pipe(
            map(
                ([ready, count, [readyChild, countChild]]) =>
                    [ready + readyChild, count + countChild] as [number, number],
            ),
            shareReplay(1),
        ),
    );

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
        this.ready$.complete();
        this.deepReady$.complete();
        this.children$.complete();
    }
}
