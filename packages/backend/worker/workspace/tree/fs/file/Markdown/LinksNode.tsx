import { linkName } from "app/src/editor/tokens/link";
import { ReactiveComponentProperty } from "app/src/utils";
import { Token } from "models";
import { map } from "rxjs";
import { LinkNode } from "../../../LinkNode";
import { DocumentNode } from "../DocumentNode";

interface LinksNodeProps {
    tokens: Token[];
}

export class LinksNode extends DocumentNode<LinksNodeProps> {
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
                    <LinkNode key={index} token={token} />
                ))}
            </>
        );
    }
}
