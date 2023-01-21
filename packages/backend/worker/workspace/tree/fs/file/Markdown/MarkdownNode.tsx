import { memo } from "react";
import { DocumentNode } from "../DocumentNode";
import { FileContentChildrenProps, FileContentNode } from "../FileContentNode";
import { FileTokensChildrenProps, FileTokensNode } from "../FileTokensNode";
import { MarkdownLinks } from "./MarkdownLinks";

const markdownBody = (
    <FileContentNode key="content">
        {memo(function ContentReciver({ content }: FileContentChildrenProps) {
            return (
                <FileTokensNode content={content}>
                    {memo(function TokensReciver({ tokens }: FileTokensChildrenProps) {
                        return <MarkdownLinks tokens={tokens} />;
                    })}
                </FileTokensNode>
            );
        })}
    </FileContentNode>
);

export class MarkdownNode extends DocumentNode {
    render() {
        return markdownBody;
    }
}
