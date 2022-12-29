import { fileContentState, fileState } from "@/atom/file/fileState";
import { workspaceState } from "@/atom/workspace/workspace";
import Editor from "@monaco-editor/react";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { DateCodeLens } from "./DateCodeLens";
import defaultValue from "./defaultValue.md?raw";
import { useDecorateEditor } from "./useDecorateEditor";
import { useDocumentTokens } from "./useDocumentTokens";

export const Document: FC = () => {
    const workspace = useRecoilValue(workspaceState);
    const file = useRecoilValue(fileState);
    const fileContent = useRecoilValue(fileContentState({ workspaceId: workspace?.id, path: file?.path }));

    const { editorRef, model, handleRef } = useDecorateEditor();
    useDocumentTokens(model);

    return (
        <>
            <Editor
                key={file?.path}
                onMount={handleRef}
                height="100%"
                width="100%"
                defaultValue={fileContent ?? defaultValue}
                defaultLanguage="markdown"
                theme="backlink"
                options={{
                    scrollBeyondLastLine: false,
                }}
            />
            <DateCodeLens editor={editorRef} model={model} />
        </>
    );
};
