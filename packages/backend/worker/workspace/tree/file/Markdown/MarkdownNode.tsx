import { DocumentNode } from "../DocumentNode";
import { FileContentNode } from "../FileContentNode";
import { FileTokensNode } from "../FileTokensNode";
import { MarkdownLinks } from "./MarkdownLinks";

export class MarkdownNode extends DocumentNode {
    render() {
        return (
            <FileContentNode>
                {({ content }) => (
                    <FileTokensNode content={content}>
                        {({ tokens }) => <MarkdownLinks tokens={tokens} />}
                    </FileTokensNode>
                )}
            </FileContentNode>
        );
    }
}
