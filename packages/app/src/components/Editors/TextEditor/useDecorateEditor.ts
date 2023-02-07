import { useRegisterEditor, useUnregisterEditor } from "@/atom/editors/editorsState";
import { useSetChanges, useSetSavedVersion } from "@/atom/file/fileChangesState";
import { container } from "@/container";
import { ReactiveValue } from "@/utils";
import { Monaco } from "@monaco-editor/react";
import { Item, WorkspaceId } from "models";
import { editor } from "monaco-editor";
import { MonacoMarkdownExtension } from "monaco-markdown";
import { useCallback, useEffect, useRef, useState } from "react";

const modelToEditor = container.get("modelToEditor");
const editorMeta = container.get("editorMeta");
const markdownExtension = new MonacoMarkdownExtension();

export function useDecorateEditor(workspaceId: WorkspaceId, item: Item<false>) {
    const registerEditor = useRegisterEditor(item.path);
    const unRegisterEditor = useUnregisterEditor(item.path);

    const setChanges = useSetChanges(item.path);
    const setSavedVersion = useSetSavedVersion(item.path);

    const editor = useRef<editor.IStandaloneCodeEditor>();
    const [editor$] = useState(() => new ReactiveValue<editor.IStandaloneCodeEditor>());

    const handleContentChange = useCallback(
        (initial: boolean) => {
            if (!editor$.value) {
                return;
            }

            const model = editor$.value.getModel();
            if (!model) {
                return;
            }

            if (initial) {
                setSavedVersion(model.getAlternativeVersionId());
            }

            setChanges(model.getValue(), model.getAlternativeVersionId());

            modelToEditor.setEditor(model, editor$.value);
        },
        [editor$.value, setChanges, setSavedVersion],
    );

    const handleRef = useCallback(
        (ref: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            editor.current = ref;
            editor$.next(ref);
            registerEditor(ref);

            markdownExtension.activate(ref as never);

            const commandId = ref.addCommand(
                0,
                function (ctx, args) {
                    console.log(ctx, args);
                    alert("my command is executing!");
                },
                "",
            );

            editorMeta.set(ref, { commandId, workspaceId, item });

            ref.onDidChangeModelContent(handleContentChange.bind(undefined, false));
            handleContentChange(true);
        },
        [editor$, handleContentChange, item, registerEditor, workspaceId],
    );

    useEffect(() => {
        return () => {
            if (editor.current) {
                const editors = unRegisterEditor(editor.current);
                if (editors?.size === 0) {
                    editor.current.getModel()?.dispose();
                }
            }
        };
    }, [workspaceId, item, unRegisterEditor]);

    return { editor$, handleRef };
}
