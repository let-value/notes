import { DockviewApi } from "dockview";
import { Workspace } from "models";
import { useCallback } from "react";
import { makeEditorPanelOptions } from "../../components/EditorPanel/EditorPanel";
import { ListItem } from "../workspace";
import { editorsDock$ } from "./editorsDock";

export const useSetEditorsDock = () =>
    useCallback((api: DockviewApi) => {
        editorsDock$.next(api);
    }, []);

export const useOpenEditorPanel = (workspace: Workspace) =>
    useCallback(
        async (item: ListItem<false>, editor?: string) => {
            const api = await editorsDock$.lastValue;

            if (!api) {
                return;
            }

            const panel = makeEditorPanelOptions({ workspace, item, editor });

            const existingPanel = api.panels.find((x) => x.id.startsWith(panel.id));
            if (existingPanel) {
                existingPanel.api.setActive();
                return;
            }

            api.addPanel(panel);
        },
        [workspace],
    );
