import { Processor } from "unified";
import { VFile } from "vfile";

export function processMarkdown<TProcessor extends Processor>(processor: TProcessor, content: string) {
    const file = new VFile();

    if (typeof content === "string") {
        file.value = content;
    } else if (content !== undefined && content !== null) {
        throw new Error(`Warning: please pass a string as \`children\` (not: \`${content}\`)`);
    }

    return processor.runSync(processor.parse(file), file) as ReturnType<TProcessor["runSync"]>;
}
