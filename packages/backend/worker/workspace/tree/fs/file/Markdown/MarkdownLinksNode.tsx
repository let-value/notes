import { linkName } from "app/src/editor/tokens/link";
import { ReactiveComponentProperty } from "app/src/utils";
import { Token } from "models";
import { map, switchMap } from "rxjs";
import { LinkNode } from "../../../graph/LinkNode";
import { LinksNode } from "../../../graph/LinksNode";
import { DocumentNode } from "../DocumentNode";

export class MarkdownLinksNode extends DocumentNode {
    links$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            switchMap(() => this.context.parent.tokens$),
            map((tokens): Token[] => tokens.filter((token) => token.type.startsWith(linkName))),
        ),
    );

    render() {
        if (!this.links$.value) {
            return null;
        }

        return (
            <LinksNode>
                {this.links$.value.map((token, index) => (
                    <LinkNode key={index} link={token.value} />
                ))}
            </LinksNode>
        );
    }
}
