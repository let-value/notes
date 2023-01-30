import { parseLink } from "app/src/editor/tokens/link";
import { createReplaySubject, ReactiveComponentProperty } from "app/src/utils";
import { combineLatest, filter, map, switchMap } from "rxjs";
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

    target$ = new ReactiveComponentProperty(
        this,
        (props$) =>
            props$.pipe(
                switchMap(() => this.link$.pipeline$),
                map((link) => link?.path),
                filter((path) => !!path),
                switchMap((path) => queue.add(() => this.context.root.registryRef.current.resolveLink(path))),
                switchMap((target) => target),
            ),
        null,
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
