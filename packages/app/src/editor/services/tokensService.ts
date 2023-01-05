import { ContextGetter } from "iti/dist/src/_utils";
import { Token } from "models";
import { editor } from "monaco-editor";
import { filter, map } from "rxjs";
import { parseModelTokens } from "../tokens/parseModelTokens";
import { ModelToEditorService } from "./modelToEditorService";

interface ModelTokens {
    version: number;
    tokens: Token[];
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

export const tokensService = (
    services: ContextGetter<{
        modelToEditor: ModelToEditorService;
    }>,
) => ({
    tokensService: () => {
        const { modelToEditor } = services;

        function getEditorTokens(editor: editor.IStandaloneCodeEditor) {
            return modelToEditor.getModel(editor).pipe(
                filter(Boolean),
                map((model) => getModelTokens(editor, model)),
            );
        }

        return {
            getEditorTokens,
            getModelTokens,
        };
    },
});
