import { ISplitviewPanelProps, PanelCollection, SplitviewReact, SplitviewReadyEvent } from "dockview";
import { useCallback } from "react";
import { editorsPanel } from "./components/EditorsPanel";
import { sidebarPanel } from "./components/SidebarPanel";
import { ContentWrapper, Title } from "./components/Title/Title";

const components: PanelCollection<ISplitviewPanelProps> = {
    ...sidebarPanel.components,
    ...editorsPanel.panel,
};

export function App() {
    const handleViewReady = useCallback((event: SplitviewReadyEvent) => {
        event.api.addPanel(sidebarPanel.options);
        event.api.addPanel(editorsPanel.options);
    }, []);

    return (
        <>
            <Title />
            <ContentWrapper>
                <SplitviewReact
                    proportionalLayout={false}
                    className="dockview-theme-light"
                    components={components}
                    onReady={handleViewReady}
                />
            </ContentWrapper>
        </>
    );
}
