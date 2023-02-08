import { useOpenEditorPanel } from "@/atom/panels";
import { ListItem, workspaceState } from "@/atom/workspace";
import { MouseEvent, useCallback } from "react";
import { useRecoilValue } from "recoil";

export function useFileContextHandlers(item: ListItem<false>) {
    const workspace = useRecoilValue(workspaceState);

    const openEditorPanel = useOpenEditorPanel(workspace);

    const handleOpen = useCallback(
        (event: MouseEvent, editor?: string) => {
            openEditorPanel(item, editor);
        },
        [item, openEditorPanel],
    );

    return {
        handleOpen,
    };
}
