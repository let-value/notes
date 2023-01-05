import { fileContentState, fileState, fileTokensState } from "@/atom/file/fileState";
import { workspaceState } from "@/atom/workspace/workspace";
import Editor from "@monaco-editor/react";
import { FC } from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { DateCodeLens } from "../../editor/codeLens/date/DateCodeLens";
import defaultValue from "./defaultValue.md?raw";
import { useDecorateEditor } from "./useDecorateEditor";

export const Document: FC = () => {
    const workspace = useRecoilValue(workspaceState);
    const item = useRecoilValue(fileState);
    const content = useRecoilValue(fileContentState({ workspaceId: workspace?.id, path: item?.path }));
    const tokens = useRecoilValueLoadable(fileTokensState({ workspaceId: workspace?.id, path: item?.path }));

    console.log("tokens", item, tokens);

    const { editor, handleRef } = useDecorateEditor();

    if (!workspace || !item) {
        return null;
    }

    return (
        <>
            <Editor
                key={item.path}
                onMount={handleRef}
                height="100%"
                width="100%"
                path={item?.path ?? "default.md"}
                defaultValue={content ?? defaultValue}
                theme="wikilink"
            />
            <DateCodeLens workspaceId={workspace.id} item={item} editorSubject={editor} />
        </>
    );
};
