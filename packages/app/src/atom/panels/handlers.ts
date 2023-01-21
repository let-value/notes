import { DockviewApi } from "dockview";
import { Item, Workspace } from "models";
import { useCallback } from "react";
import { makeEditorPanelOptions } from "../../components/EditorPanel/EditorPanel";
import { editorsDock$ } from "./editorsDock";

export const useSetEditorsDock = () =>
    useCallback((api: DockviewApi) => {
        editorsDock$.next(api);
    }, []);

export const useOpenEditorPanel = (workspace: Workspace) =>
    useCallback(
        async (item: Item) => {
            const api = await editorsDock$.lastValue;

            if (!api) {
                return;
            }

            const panel = makeEditorPanelOptions({ workspace, item });

            const existingPanel = api.panels.find((x) => x.id.startsWith(panel.id));
            if (existingPanel) {
                existingPanel.api.setActive();
                return;
            }

            api.addPanel(panel);
        },
        [workspace],
    );
