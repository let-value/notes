import { editor } from "monaco-editor";

export interface EditorMetadata {
    commandId: string | null;
}

const editorMetadata = new WeakMap<editor.IStandaloneCodeEditor, EditorMetadata>();

export function setEditorMetadata(editor: editor.IStandaloneCodeEditor, metadata: EditorMetadata) {
    editorMetadata.set(editor, metadata);
}

export function getEditorMetadata(editor: editor.IStandaloneCodeEditor) {
    return editorMetadata.get(editor);
}
