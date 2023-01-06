import { container } from "@/container";
import { ReactiveValue } from "@/utils";
import { Monaco } from "@monaco-editor/react";
import { Item, WorkspaceId } from "models";
import { editor } from "monaco-editor";
import { useCallback, useState } from "react";

const modelToEditor = container.get("modelToEditor");
const editorMeta = container.get("editorMeta");

export function useDecorateEditor(workspaceId: WorkspaceId, item: Item<false>) {
    const [editorSubject] = useState(() => new ReactiveValue<editor.IStandaloneCodeEditor>());

    const handleContentChange = useCallback(() => {
        if (!editorSubject.value) {
            return;
        }

        const model = editorSubject.value.getModel();
        if (!model) {
            return;
        }

        modelToEditor.setEditor(model, editorSubject.value);
    }, [editorSubject]);

    const handleRef = useCallback(
        (ref: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            editorSubject.next(ref);

            ref.addCommand(
                monaco.KeyMod.chord(
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                ),
                () => {
                    console.log("save");
                },
            );

            const commandId = ref.addCommand(
                0,
                function (ctx, args) {
                    console.log(ctx, args);
                    alert("my command is executing!");
                },
                "",
            );

            editorMeta.set(ref, { commandId, workspaceId, item });

            ref.onDidChangeModelContent(handleContentChange);
            handleContentChange();
        },
        [editorSubject, handleContentChange, item, workspaceId],
    );

    return { editor: editorSubject, handleRef };
}
