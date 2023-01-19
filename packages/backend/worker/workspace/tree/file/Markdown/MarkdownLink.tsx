import { parseLink } from "app/src/editor/tokens/link";
import { ReactiveComponentProperty } from "app/src/utils";
import { Token } from "models";
import { map, mergeMap } from "rxjs";
import { DocumentNode } from "../DocumentNode";

interface MarkdownLinkProps {
    token: Token;
}

export class MarkdownLink extends DocumentNode<MarkdownLinkProps> {
    link = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.token),
            map((token) => parseLink(token.value)),
        ),
    );

    target = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            mergeMap(() => this.link.pipeline$),
            mergeMap(async (link) => {
                const registry = await this.context.store.registry.lastValue;
                return registry.resolveLink(this.context.parent.props.item, link.path);
            }),
        ),
    );

    render() {
        if (this.target.value == undefined) {
            return null;
        }
        console.log(this.props.token, this.link.value, this.target.value);

        return null;
    }
}
