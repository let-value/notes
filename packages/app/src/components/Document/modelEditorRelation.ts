import { editor } from "monaco-editor";

const modelEditorRelation = new WeakMap<editor.ITextModel, editor.IStandaloneCodeEditor>();

export function getModelEditor(model: editor.ITextModel) {
    return modelEditorRelation.get(model);
}

export function setModelEditor(model: editor.ITextModel, editor: editor.IStandaloneCodeEditor) {
    modelEditorRelation.set(model, editor);
}
