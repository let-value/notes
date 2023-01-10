import { useSetEditorsDock } from "@/atom/panels";
import {
    AddSplitviewComponentOptions,
    DockviewReact,
    DockviewReadyEvent,
    IDockviewPanelProps,
    ISplitviewPanelProps,
    PanelCollection,
} from "dockview";
import { FC, useCallback } from "react";
import { editorPanel, EditorPanelProps } from "./EditorPanel";
import { ErrorBoundary } from "./ErrorBoundary";

//workspace && item && <Document workspace={workspace} item={item} />

const components: PanelCollection<IDockviewPanelProps<EditorPanelProps>> = {
    ...editorPanel.panel,
};

export const EditorsPanel: FC<ISplitviewPanelProps> = () => {
    const setApi = useSetEditorsDock();

    const handleDockReady = useCallback(
        (event: DockviewReadyEvent) => {
            setApi(event.api);
        },
        [setApi],
    );

    return (
        <ErrorBoundary>
            <DockviewReact className="dockview-theme-light" components={components} onReady={handleDockReady} />
        </ErrorBoundary>
    );
};

const id = "editors";

const options: AddSplitviewComponentOptions = {
    id,
    component: id,
    minimumSize: 200,
};

const panel: PanelCollection<ISplitviewPanelProps> = {
    [id]: EditorsPanel,
};

export const editorsPanel = { id, options, panel };
