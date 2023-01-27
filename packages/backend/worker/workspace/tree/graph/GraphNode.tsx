import { groupBy } from "lodash-es";
import { BehaviorSubject, combineLatest, map, mergeMap } from "rxjs";
import { TreeContextProps, TreeNode } from "../TreeNode";
import { WorkspaceNode } from "../WorkspaceNode";
import { LinkNode } from "./LinkNode";

export class GraphNode extends TreeNode {
    declare context: TreeContextProps<WorkspaceNode>;
    declare children$: BehaviorSubject<LinkNode[]>;

    graph$ = this.children$.pipe(
        map((children) => children.map((link) => link.target$.pipeline$.pipe(map((target) => ({ link, target }))))),
        mergeMap((links) => combineLatest(links)),
        map((links) => groupBy(links, (x) => x.target.path)),
    );

    declare addChildren: (node: LinkNode) => void;
    declare removeChildren: (node: LinkNode) => void;

    render() {
        return null;
    }
}
