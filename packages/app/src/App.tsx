import { ISplitviewPanelProps, PanelCollection, SplitviewReact, SplitviewReadyEvent } from "dockview";
import { Suspense, useCallback } from "react";
import { atomService } from "./atom/storeServices";
import { editorsPanel } from "./components/EditorsPanel";
import { sidebarPanel } from "./components/SidebarPanel";
import { ContentWrapper, Title } from "./components/Title/Title";
import { container } from "./container";
import { WorkerProvider } from "./WorkerProvider";

await import("./features");
await import("./editor/setupMonacoEditor");

atomService(container as never);

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
            <Suspense>
                <WorkerProvider>
                    <Title />
                    <ContentWrapper>
                        <SplitviewReact
                            proportionalLayout={false}
                            className="dockview-theme-light"
                            components={components}
                            onReady={handleViewReady}
                        />
                    </ContentWrapper>
                </WorkerProvider>
            </Suspense>
        </>
    );
}

export default App;
