import { Token } from "models";
import { editor } from "monaco-editor";

export function parseModelTokens(model: editor.ITextModel) {
    console.log("parseModelTokens", model.getVersionId());
    const result: Token[] = [];

    const language = model.getLanguageId();
    const value = model.getValue();
    const resolvedTokens = editor.tokenize(value, language);

    const lines = model.getLineCount();
    for (let lineIndex = 0; lineIndex < lines; lineIndex++) {
        const lineTokens = resolvedTokens?.[lineIndex];
        const currentLine = model.getLineContent(lineIndex + 1);
        const lineLength = currentLine.length;

        for (let tokenIndex = 0; tokenIndex < (lineTokens?.length ?? 0); tokenIndex++) {
            const currentToken = lineTokens?.[tokenIndex];
            const nextToken = lineTokens?.[tokenIndex + 1];
            const start = currentToken?.offset ?? 0;
            const end = nextToken?.offset ?? lineLength;
            const type = currentToken?.type ?? "";
            const value = currentLine.substring(start, end);

            const token: Token = {
                language,
                line: lineIndex,
                start,
                end,
                type,
                value,
            };

            result.push(token);
        }
    }

    return result;
}
