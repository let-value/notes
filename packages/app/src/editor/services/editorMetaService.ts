import { Item, WorkspaceId } from "models";
import { editor } from "monaco-editor";

export interface EditorMetadata {
    commandId: string | null;
    workspaceId: WorkspaceId;
    item: Item<false>;
}

const map = new WeakMap<editor.IStandaloneCodeEditor, EditorMetadata>();

function get(editor: editor.IStandaloneCodeEditor) {
    return map.get(editor);
}

function set(editor: editor.IStandaloneCodeEditor, metadata: EditorMetadata) {
    map.set(editor, metadata);
}

export const editorMetaService = {
    editorMeta: () => ({
        get,
        set,
    }),
};

export type EditorMetadataService = ReturnType<typeof editorMetaService.editorMeta>;
