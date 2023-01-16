import { incrementFileNameIfExist } from "@/utils";
import { DockviewApi } from "dockview";
import { Item, Workspace } from "models";
import { useCallback } from "react";
import { makeEditorPanelOptions } from "../../components/EditorPanel/EditorPanel";
import { editorsDock$ } from "./editorsDock";

export const useSetEditorsDock = () =>
    useCallback((api: DockviewApi) => {
        editorsDock$.next(api);
        api.onDidLayoutChange(() => editorsDock$.next(api));
    }, []);

export const useOpenEditorPanel = (workspace: Workspace) =>
    useCallback(
        async (item: Item) => {
            const api = await editorsDock$.lastValue;

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
