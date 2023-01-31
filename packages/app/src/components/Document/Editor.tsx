import { fileContentState } from "@/atom/file";
import Monaco from "@monaco-editor/react";
import { Item, Workspace } from "models";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { DateCodeLens } from "../../editor/codeLens/date/DateCodeLens";
import defaultValue from "./defaultValue.md?raw";
import { useDecorateEditor } from "./useDecorateEditor";

export interface DocumentProps {
    workspace: Workspace;
    item: Item<false>;
}

export const Editor: FC<DocumentProps> = ({ workspace, item }) => {
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
                defaultValue={content ?? defaultValue}
                theme="wikilink"
            />
            <DateCodeLens workspaceId={workspace.id} item={item} editor$={editor$} />
        </>
    );
};
