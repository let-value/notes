import { fileContentState, fileState } from "@/atom/file/fileState";
import { workspaceState } from "@/atom/workspace/workspace";
import Editor from "@monaco-editor/react";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { DateCodeLens } from "../../editor/codeLens/date/DateCodeLens";
import defaultValue from "./defaultValue.md?raw";
import { useDecorateEditor } from "./useDecorateEditor";

export const Document: FC = () => {
    const workspace = useRecoilValue(workspaceState);
    const file = useRecoilValue(fileState);
    const fileContent = useRecoilValue(fileContentState({ workspaceId: workspace?.id, path: file?.path }));

    const { editor, handleRef } = useDecorateEditor();

    return (
        <>
            <Editor
                key={file?.path}
                onMount={handleRef}
                height="100%"
                width="100%"
                path={file?.path ?? "default.md"}
                defaultValue={fileContent ?? defaultValue}
                theme="wikilink"
            />
            <DateCodeLens editorSubject={editor} />
        </>
    );
};
