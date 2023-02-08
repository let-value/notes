import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { Plugin, Processor, unified } from "unified";

export function useRemarkProcessor(source?: Processor, remarkPlugins: Plugin[] = [remarkGfm as never]) {
    return (source ?? unified()).use(remarkParse).use(remarkPlugins);
}
