import { parseLink } from "app/src/editor/tokens/link";
import { ReactiveComponentProperty } from "app/src/utils";
import { Token } from "models";
import { combineLatest, map, mergeMap } from "rxjs";
import { DocumentNode } from "../fs/file/DocumentNode";

interface LinkProps {
    token: Token;
}

export class LinkNode extends DocumentNode<LinkProps> {
    link$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.token),
            map((token) => parseLink(token.value)),
        ),
    );

    target$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            mergeMap(() => this.link$.pipeline$),
            mergeMap((link) => this.context.root.registryRef.current.resolveLink(link.path)),
            mergeMap((target) => target),
        ),
    );

    ready$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            mergeMap(() =>
                combineLatest([this.link$.pipeline$, this.target$.pipeline$]).pipe(
                    map(([link, target]) => !!link && !!target),
                ),
            ),
        ),
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
        if (!this.target$.value) {
            return null;
        }

        return null;
    }
}
