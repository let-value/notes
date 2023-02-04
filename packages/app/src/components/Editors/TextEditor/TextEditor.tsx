import { fileContentState } from "@/atom/file";
import Monaco from "@monaco-editor/react";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { DateCodeLens } from "../../../editor/codeLens/date/DateCodeLens";
import { EditorProps } from "../EditorProps";
import { useDecorateEditor } from "./useDecorateEditor";

export const TextEditor: FC<EditorProps> = ({ workspace, item }) => {
    const content = useRecoilValue(fileContentState({ workspaceId: workspace?.id, path: item?.path }));

    const { editor$, handleRef } = useDecorateEditor(workspace.id, item);

    return (
        <>
            <Monaco
                keepCurrentModel
                saveViewState={false}
                key={item.path}
                onMount={handleRef}
                height="100%"
                width="100%"
                path={item?.path ?? "default.md"}
                defaultValue={content}
                theme="wikilink"
            />
            <DateCodeLens workspaceId={workspace.id} item={item} editor$={editor$} />
        </>
    );
};
