import { html } from "property-information";
import { createElement, FC, Fragment, ReactElement } from "react";
import { childrenToReact, Options as AstOptions } from "react-markdown/lib/ast-to-react";
import { Plugin, unified } from "unified";
import { processMarkdown } from "./processMarkdown";
import { RehypeFilterOptions, RemarkRehypeOptions, useRehypeProcessor } from "./useRehypeProcessor";
import { useRemarkProcessor } from "./useRemarkProcessor";

interface MarkdownProps {
    children: string;
    remarkPlugins?: Plugin[];
    remarkRehypeOptions?: RemarkRehypeOptions;
    rehypePlugins?: Plugin[];
    rehypeFilterOptions?: RehypeFilterOptions;
    options?: AstOptions;
}

export const Markdown: FC<MarkdownProps> = ({
    children,
    remarkPlugins = undefined,
    remarkRehypeOptions,
    rehypePlugins = undefined,
    rehypeFilterOptions = undefined,
    options = {},
}) => {
    //const remarkProcessor = useRemarkProcessor(unified(), remarkPlugins);
    const processor = useRehypeProcessor(
        useRemarkProcessor(unified(), remarkPlugins),
        remarkRehypeOptions,
        rehypePlugins,
        rehypeFilterOptions,
    );

    //const mdastNode = processMarkdown(remarkProcessor, children);
    const hastNode = processMarkdown(processor, children);

    //console.log(mdastNode, hastNode);

    if (hastNode.type !== "root") {
        throw new TypeError("Expected a `root` node");
    }

    const result: ReactElement = createElement(
        Fragment,
        {},
        childrenToReact({ options, schema: html, listDepth: 0 }, hastNode),
    );

    return result;
};
