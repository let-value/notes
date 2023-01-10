import { AddSplitviewComponentOptions, ISplitviewPanelProps, PanelCollection } from "dockview";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { workspaceState } from "../atom/workspace";
import { Explorer } from "./Explorer/Explorer";
import { withSuspense } from "./withSuspense";

const id = "sidebar";

export const SidebarPanel: FC<ISplitviewPanelProps> = () => {
    const workspace = useRecoilValue(workspaceState);

    if (!workspace) {
        return null;
    }

    return <Explorer workspace={workspace} />;
};

const options: AddSplitviewComponentOptions = {
    id,
    component: id,

    minimumSize: 200,
    maximumSize: 400,
    size: 300,
    snap: true,
};

const components: PanelCollection<ISplitviewPanelProps> = {
    [id]: withSuspense(SidebarPanel),
};

export const sidebarPanel = { options, components };
