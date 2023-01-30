import { createReplaySubject } from "app/src/utils";
import { groupBy } from "lodash-es";
import { BehaviorSubject, combineLatest, interval, map, switchMap, throttle } from "rxjs";
import { TreeContextProps, TreeNode } from "../TreeNode";
import { WorkspaceNode } from "../WorkspaceNode";
import { LinkNode } from "./LinkNode";

export class GraphNode extends TreeNode {
    declare context: TreeContextProps<WorkspaceNode>;
    declare children$: BehaviorSubject<LinkNode[]>;
    declare addChildren: (node: LinkNode) => void;
    declare removeChildren: (node: LinkNode) => void;

    deepReady$ = new BehaviorSubject(true);
    progress$ = new BehaviorSubject([0, 0] as [number, number]);

    graph$ = createReplaySubject(
        this.children$.pipe(
            throttle(() => interval(2000)),
            map((children) => children.map((link) => link.target$.pipeline$.pipe(map((target) => ({ link, target }))))),
            switchMap((links) => combineLatest(links)),
            map((links) => groupBy(links, (x) => x.target.path)),
        ),
        1,
    );

    render() {
        return null;
    }
}
