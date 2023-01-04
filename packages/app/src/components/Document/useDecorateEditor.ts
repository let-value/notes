import { container } from "@/container";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useCallback, useState } from "react";
import { BehaviorSubject } from "rxjs";

const modelToEditor = container.get("modelToEditor");
const editorMeta = container.get("editorMeta");

export function useDecorateEditor() {
    const [editorSubject] = useState(() => new BehaviorSubject<editor.IStandaloneCodeEditor | undefined>(undefined));

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

            editorMeta.set(ref, { commandId });

            ref.onDidChangeModelContent(handleContentChange);
            handleContentChange();
        },
        [editorSubject, handleContentChange],
    );

    return { editor: editorSubject, handleRef };
}
