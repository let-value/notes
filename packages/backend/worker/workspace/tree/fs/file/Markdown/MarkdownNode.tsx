import { DocumentNode } from "../DocumentNode";
import { FileContentNode } from "../FileContentNode";
import { FileTokensNode } from "../FileTokensNode";
import { LinksNode } from "./LinksNode";

export class MarkdownNode extends DocumentNode {
    render() {
        return (
            <FileContentNode>
                {({ content }) => (
                    <FileTokensNode content={content}>{({ tokens }) => <LinksNode tokens={tokens} />}</FileTokensNode>
                )}
            </FileContentNode>
        );
    }
}