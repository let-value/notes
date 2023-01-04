import { ContextGetter } from "iti/dist/src/_utils";
import { Token } from "models";
import { editor } from "monaco-editor";
import { filter, map } from "rxjs";
import { parseModelTokens } from "../tokens/parseModelTokens";
import { ModelToEditorService } from "./modelToEditorService";

const modelTokens = new WeakMap<editor.ITextModel, Token[]>();

export function getModelTokens(model: editor.ITextModel) {
    let tokens = modelTokens.get(model);
    if (!tokens) {
        tokens = parseModelTokens(model);
        modelTokens.set(model, tokens);
    }
    return tokens;
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
                map((model) => getModelTokens(model)),
            );
        }

        return {
            getEditorTokens,
            getModelTokens,
        };
    },
});
