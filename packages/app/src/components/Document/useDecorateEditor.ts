import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MutableRefObject, useCallback, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import { setEditorMetadata } from "./editorMetadata";
import { setModelEditor } from "./modelEditorRelation";

export function useDecorateEditor() {
    const editorRef = useRef<editor.IStandaloneCodeEditor>(null) as MutableRefObject<editor.IStandaloneCodeEditor>;
    const editor = useRef(new BehaviorSubject<editor.IStandaloneCodeEditor | null>(null));
    const model = useRef(new BehaviorSubject<editor.ITextModel | null>(null));

    const handleContentChange = useCallback(() => {
        if (!editorRef.current) {
            return;
        }

        const newModel = editorRef.current.getModel();

        if (!newModel) {
            return;
        }

        setModelEditor(newModel, editorRef.current);
        model.current.next(newModel);
    }, []);

    const handleRef = useCallback(
        (ref: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            editorRef.current = ref;
            editor.current.next(ref);

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

            setEditorMetadata(ref, { commandId });

            ref.onDidChangeModelContent(handleContentChange);
            handleContentChange();
        },
        [handleContentChange],
    );

    return { editorRef, editor, model, handleRef };
}
