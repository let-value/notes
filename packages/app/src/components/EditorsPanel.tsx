import { useSetEditorsDock } from "@/atom/panels";
import {
    AddSplitviewComponentOptions,
    DockviewReact,
    DockviewReadyEvent,
    IDockviewPanelHeaderProps,
    IDockviewPanelProps,
    ISplitviewPanelProps,
    PanelCollection,
} from "dockview";
import { FC, useCallback } from "react";
import { editorPanel } from "./EditorPanel/EditorPanel";
import { EditorPanelProps } from "./EditorPanel/EditorPanelProps";
import { editorTab } from "./EditorPanel/EditorTab";
import { ErrorBoundary } from "./ErrorBoundary";

const components: PanelCollection<IDockviewPanelProps<EditorPanelProps>> = {
    ...editorPanel.collection,
};

const tabComponents: PanelCollection<IDockviewPanelHeaderProps> = {
    ...editorTab.collection,
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
            <DockviewReact
                className="dockview-theme-light"
                components={components}
                tabComponents={tabComponents}
                onReady={handleDockReady}
            />
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
