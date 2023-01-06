import { fileContentState } from "@/atom/file";
import { ContextGetter } from "iti/dist/src/_utils";
import { Token } from "models";
import { editor } from "monaco-editor";
import { getRecoil } from "recoil-nexus";
import { filter, map } from "rxjs";
import { parseModelTokens } from "../tokens/parseModelTokens";
import { EditorMetadataService } from "./editorMetaService";
import { ModelToEditorService } from "./modelToEditorService";

interface ModelTokens {
    version: number;
    tokens: Token[];
}

export interface CompensatedToken extends Token {
    compensatedStart: number;
    compensatedEnd: number;
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

export function getModelCompensatedTokens(
    editor: editor.IStandaloneCodeEditor,
    model: editor.ITextModel,
    content?: string,
) {
    return getModelTokens(editor, model);
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
