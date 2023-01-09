import { memo, useMemo } from "react";
import { FilePropsWithTokens } from "../FileComponentProps";
import { withTokens } from "../WithTokens";
import { MarkdownBacklink } from "./MarkdownBacklink";

export const Markdown = withTokens(
    memo(function Markdown({ tokens, ...item }: FilePropsWithTokens) {
        const backlinks = useMemo(() => tokens?.filter((token) => token.type.startsWith("wikilink")), [tokens]);

        return (
            <>
                {backlinks?.map((token, index) => (
                    <MarkdownBacklink key={index} from={item} token={token} />
                ))}
            </>
        );
    }),
);
