import { linkName } from "app/src/editor/tokens/link";
import { ReactiveComponentProperty } from "app/src/utils";
import { Token } from "models";
import { map } from "rxjs";
import { DocumentNode } from "../DocumentNode";
import { MarkdownLink } from "./MarkdownLink";

interface MarkdownLinksProps {
    tokens: Token[];
}

export class MarkdownLinks extends DocumentNode<MarkdownLinksProps> {
    links = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.tokens),
            map((tokens): Token[] => tokens.filter((token) => token.type.startsWith(linkName))),
        ),
    );

    render() {
        if (!this.links.value) {
            return null;
        }

        return (
            <>
                {this.links.value.map((token, index) => (
                    <MarkdownLink key={index} token={token} />
                ))}
            </>
        );
    }
}
