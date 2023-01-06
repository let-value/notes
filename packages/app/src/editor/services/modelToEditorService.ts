import { ReactiveWeakMap } from "@/utils";
import { editor } from "monaco-editor";

const modelToEditor = new ReactiveWeakMap<editor.ITextModel, editor.IStandaloneCodeEditor>();
const editorToModel = new ReactiveWeakMap<editor.IStandaloneCodeEditor, editor.ITextModel>();

function getModel(editor: editor.IStandaloneCodeEditor) {
    return editorToModel.get(editor);
}

function setModel(editor: editor.IStandaloneCodeEditor, model: editor.ITextModel) {
    getModel(editor).next(model);
}

function getEditor(model: editor.ITextModel) {
    return modelToEditor.get(model);
}

function setEditor(model: editor.ITextModel, editor: editor.IStandaloneCodeEditor) {
    modelToEditor.setValue(model, editor);
    setModel(editor, model);
}

export const modelToEditorService = {
    modelToEditor: () => ({
        getModel,
        setModel,
        getEditor,
        setEditor,
    }),
};

export type ModelToEditorService = ReturnType<typeof modelToEditorService.modelToEditor>;
