import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { Plugin, Processor, unified } from "unified";
import { linkPlugin } from "./linkPlugin";

export function useRemarkProcessor(
    source?: Processor,
    remarkPlugins: Plugin[] = [remarkGfm as never, linkPlugin as never],
) {
    return (source ?? unified()).use(remarkParse).use(remarkPlugins);
}
