import { incrementFileNameIfExist } from "@/utils";
import { DockviewApi } from "dockview";
import { Item, Workspace } from "models";
import { createRef, MutableRefObject, useCallback } from "react";
import { makeEditorPanelOptions } from "../../components/EditorPanel/EditorPanel";

export const editorsDockRef = createRef() as MutableRefObject<DockviewApi | undefined>;

export const useSetEditorsDock = () =>
    useCallback((api: DockviewApi) => {
        editorsDockRef.current = api;

        api.onDidLayoutChange((event) => console.log(event));
    }, []);

export const useOpenEditorPanel = (workspace: Workspace) =>
    useCallback(
        (item: Item) => {
            const api = editorsDockRef.current;

            if (!api) {
                return;
            }

            const panel = makeEditorPanelOptions({ workspace, item });

            const existingPanel = api.panels.filter((x) => x.id.startsWith(panel.id));
            if (existingPanel.length > 0) {
                panel.id = incrementFileNameIfExist(
                    panel.id,
                    existingPanel.map((x) => x.id),
                );
                // existingPanel.api.setActive();
                // return;
            }

            api.addPanel(panel);
        },
        [workspace],
    );
