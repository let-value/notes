import { showSidebarState } from "@/state/menu/ViewMenu/ShowSidePanel";
import { AddSplitviewComponentOptions, ISplitviewPanelProps, PanelCollection } from "dockview";
import { useObservable, useSubscription } from "observable-hooks";
import { FC, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { fromEventPattern } from "rxjs";
import { workspaceState } from "../atom/workspace";
import { Explorer } from "./Explorer/Explorer";

import { withSuspense } from "./withSuspense";

const id = "sidebar";

export const SidebarPanel: FC<ISplitviewPanelProps> = ({ api }) => {
    const workspace = useRecoilValue(workspaceState);

    useEffect(() => {
        api.setSize({ size: 300 });
    }, [api]);

    useSubscription(showSidebarState, (value) => api.setVisible(value));

    const visible = useObservable(
        () =>
            fromEventPattern<boolean>(
                (handler) => api.onDidVisibilityChange(handler),
                (_, signal) => signal.dispose(),
                (event) => event.isVisible,
            ),
        [api],
    );

    useSubscription(visible, (value) => showSidebarState.next(value));

    if (!workspace) {
        return null;
    }

    return <Explorer />;
};

const options: AddSplitviewComponentOptions = {
    id,
    component: id,
    minimumSize: 200,
    snap: true,
};

const components: PanelCollection<ISplitviewPanelProps> = {
    [id]: withSuspense(SidebarPanel),
};

export const sidebarPanel = { options, components };
