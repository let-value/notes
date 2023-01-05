import { editor } from "monaco-editor";
import { BehaviorSubject } from "rxjs";

const modelToEditor = new WeakMap<editor.ITextModel, editor.IStandaloneCodeEditor>();
const editorToModel = new WeakMap<editor.IStandaloneCodeEditor, BehaviorSubject<editor.ITextModel | undefined>>();

function getModel(editor: editor.IStandaloneCodeEditor) {
    let modelSubject = editorToModel.get(editor);
    if (!modelSubject) {
        modelSubject = new BehaviorSubject<editor.ITextModel | undefined>(undefined);
        editorToModel.set(editor, modelSubject);
    }
    return modelSubject;
}

function setModel(editor: editor.IStandaloneCodeEditor, model: editor.ITextModel) {
    const modelSubject = getModel(editor);
    console.log("setModel", model.getVersionId());
    modelSubject.next(model);
}

function getEditor(model: editor.ITextModel) {
    return modelToEditor.get(model);
}

function setEditor(model: editor.ITextModel, editor: editor.IStandaloneCodeEditor) {
    modelToEditor.set(model, editor);
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
