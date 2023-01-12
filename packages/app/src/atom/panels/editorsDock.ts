import { makeEditorPanelOptions } from "@/components/EditorPanel";
import { DockviewApi } from "dockview";
import { Item, Workspace } from "models";
import { createRef, MutableRefObject, useCallback } from "react";

export const editorsDockRef = createRef() as MutableRefObject<DockviewApi | undefined>;

export const useSetEditorsDock = () =>
    useCallback((api: DockviewApi) => {
        editorsDockRef.current = api;
    }, []);

export const useOpenEditorPanel = (workspace: Workspace) =>
    useCallback(
        (item: Item) => {
            const api = editorsDockRef.current;

            if (!api) {
                return;
            }

            const panel = makeEditorPanelOptions({ workspace, item });

            const existingPanel = api.panels.find((x) => x.id === panel.id);
            if (existingPanel) {
                existingPanel.api.setActive();
                return;
            }

            api.addPanel(panel);
        },
        [workspace],
    );
