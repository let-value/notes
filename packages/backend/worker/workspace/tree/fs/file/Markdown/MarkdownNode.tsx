import { DocumentNode } from "../DocumentNode";

import { MarkdownLinksNode } from "./MarkdownLinksNode";

export class MarkdownNode extends DocumentNode {
    render() {
        return <MarkdownLinksNode />;
    }
}
