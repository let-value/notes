import { fileContentState } from "@/atom/file";
import { DIFF_DELETE, DIFF_EQUAL, DIFF_INSERT, diff_match_patch } from "diff-match-patch";
import type { ContextGetter } from "iti/dist/src/_utils";
import lineColumn from "line-column";
import { Token } from "models";
import { editor } from "monaco-editor";
import { getRecoil } from "recoil-nexus";
import { filter, map } from "rxjs";
import { parseModelTokens } from "../tokens/parseModelTokens";
import { EditorMetadataService } from "./editorMetaService";
import { ModelToEditorService } from "./modelToEditorService";

const dmp = new diff_match_patch();

interface ModelTokens {
    version: number;
    tokens: Token[];
}

export interface CompensatedToken extends Token {
    compensatedLine?: number;
    compensatedStart?: number;
}

const modelTokens = new WeakMap<editor.IStandaloneCodeEditor, ModelTokens>();

export function getModelTokens(editor: editor.IStandaloneCodeEditor, model: editor.ITextModel) {
    const version = model.getVersionId();
    let currentTokens = modelTokens.get(editor);
    if (!currentTokens || currentTokens.version !== version) {
        const tokens = parseModelTokens(model);
        currentTokens = {
            version,
            tokens,
        };
        modelTokens.set(editor, currentTokens);
    }
    return currentTokens.tokens;
}

function textToLines(text: string) {
    const lines: string[] = [];
    let lineStart = 0;
    let lineEnd = -1;
    while (lineEnd < text.length - 1) {
        lineEnd = text.indexOf("\n", lineStart);
        if (lineEnd == -1) {
            lineEnd = text.length - 1;
        }

        const line = text.substring(lineStart, lineEnd + 1);
        lines.push(line);
        lineStart = lineEnd + 1;
    }
    return lines;
}

function lineMode(text1 = "", text2 = "") {
    // Scan the text on a line-by-line basis first.
    const a = dmp.diff_linesToChars_(text1, text2);
    text1 = a.chars1;
    text2 = a.chars2;
    const linearray = a.lineArray;

    const diffs = dmp.diff_main(text1, text2, false);

    // Convert the diff back to original text.
    dmp.diff_charsToLines_(diffs, linearray);
    // Eliminate freak matches (e.g. blank lines)
    dmp.diff_cleanupSemantic(diffs);

    // Rediff any replacement blocks, this time character-by-character.
    // Add a dummy entry at the end.
    diffs.push([DIFF_EQUAL, ""]);
    let pointer = 0;
    let count_delete = 0;
    let count_insert = 0;
    let text_delete = "";
    let text_insert = "";
    while (pointer < diffs.length) {
        switch (diffs[pointer][0]) {
            case DIFF_INSERT:
                count_insert++;
                text_insert += diffs[pointer][1];
                break;
            case DIFF_DELETE:
                count_delete++;
                text_delete += diffs[pointer][1];
                break;
            case DIFF_EQUAL:
                // Upon reaching an equality, check for prior redundancies.
                if (count_delete >= 1 && count_insert >= 1) {
                    // Delete the offending records and add the merged ones.
                    diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert);
                    pointer = pointer - count_delete - count_insert;
                    const subDiff = dmp.diff_main(text_delete, text_insert, false);
                    for (let j = subDiff.length - 1; j >= 0; j--) {
                        diffs.splice(pointer, 0, subDiff[j]);
                    }
                    pointer = pointer + subDiff.length;
                }
                count_insert = 0;
                count_delete = 0;
                text_delete = "";
                text_insert = "";
                break;
        }
        pointer++;
    }
    diffs.pop(); // Remove the dummy entry at the end.

    return diffs;
}

export function getModelCompensatedTokens(
    editor: editor.IStandaloneCodeEditor,
    model: editor.ITextModel,
    content?: string,
) {
    const tokens = getModelTokens(editor, model);
    const oldValue = content ?? "";
    const newValue = model.getValue();
    const oldFinder = lineColumn(oldValue, { origin: 0 });
    const newFinder = lineColumn(newValue, { origin: 0 });
    const diffs = lineMode(newValue, oldValue);

    const compensatedTokens = tokens.map((token): CompensatedToken => {
        const newLocation = newFinder.toIndex({ line: token.line, col: token.start });
        const oldLocation = dmp.diff_xIndex(diffs, newLocation);
        const oldIndex = oldFinder.fromIndex(oldLocation);
        return {
            ...token,
            compensatedStart: oldIndex?.col,
            compensatedLine: oldIndex?.line,
        };
    });

    return compensatedTokens;
}

export const tokensService = (
    services: ContextGetter<{
        modelToEditor: ModelToEditorService;
        editorMeta: EditorMetadataService;
    }>,
) => ({
    tokensService: () => {
        const { modelToEditor, editorMeta } = services;

        function getEditorTokens(editor: editor.IStandaloneCodeEditor) {
            return modelToEditor.getModel(editor).pipe(
                filter(Boolean),
                map((model) => getModelTokens(editor, model)),
            );
        }

        function getEditorCompensatedTokens(editor: editor.IStandaloneCodeEditor) {
            return modelToEditor.getModel(editor).pipe(
                map((model) => {
                    const meta = editorMeta.get(editor);
                    if (!model || !meta) {
                        return undefined;
                    }

                    const content = getRecoil(
                        fileContentState({ workspaceId: meta.workspaceId, path: meta.item.path }),
                    );

                    return {
                        model,
                        content,
                    };
                }),
                filter(Boolean),
                map(({ model, content }) => getModelCompensatedTokens(editor, model, content)),
            );
        }

        return {
            getEditorTokens,
            getModelTokens,
            getEditorCompensatedTokens,
        };
    },
});
