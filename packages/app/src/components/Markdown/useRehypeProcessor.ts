import rehypeFilter, { Options as RehypeFilterOptions } from "react-markdown/lib/rehype-filter";
import remarkRehype, { Options as RemarkRehypeOptions } from "remark-rehype";
import { Plugin, Processor } from "unified";

export type { RehypeFilterOptions, RemarkRehypeOptions };

export function useRehypeProcessor(
    source: Processor,
    remarkRehypeOptions: RemarkRehypeOptions = {},
    rehypePlugins: Plugin[] = [],
    rehypeFilterOptions: RehypeFilterOptions = {},
) {
    return source
        .use(remarkRehype, {
            ...remarkRehypeOptions,
            allowDangerousHtml: true,
        })
        .use(rehypePlugins)
        .use(rehypeFilter, rehypeFilterOptions);
}
