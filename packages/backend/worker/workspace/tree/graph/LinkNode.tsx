import { parseLink } from "app/src/editor/tokens/link";
import { createReplaySubject, ReactiveComponentProperty } from "app/src/utils";
import { combineLatest, map, startWith, switchMap } from "rxjs";
import { container } from "../../../container";
import { TreeNode } from "../TreeNode";

const queue = container.get("queue");

interface LinkProps {
    link: string;
}

export class LinkNode extends TreeNode<LinkProps> {
    link$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.link),
            map((link) => parseLink(link)),
        ),
    );

    target$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            switchMap(() => this.link$.pipeline$),
            switchMap((link) => queue.add(() => this.context.root.registryRef.current.resolveLink(link.path))),
            switchMap((target) => target),
            startWith(null),
        ),
    );

    ready$ = createReplaySubject(
        combineLatest([this.link$.pipeline$, this.target$.pipeline$]).pipe(
            map(([link, target]) => link !== undefined && target !== undefined),
        ),
        1,
    );

    componentDidMount() {
        super.componentDidMount();
        this.context.root.graphRef.current?.addChildren(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.context.root.graphRef.current?.removeChildren(this);
    }

    render() {
        return null;
    }
}
