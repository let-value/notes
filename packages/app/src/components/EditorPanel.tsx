import { AddPanelOptions, IDockviewPanelProps, PanelCollection } from "dockview";
import { Item, Workspace } from "models";
import { FC } from "react";
import { Document } from "./Document/Document";
import { withSuspense } from "./withSuspense";

export interface EditorPanelProps {
    workspace: Workspace;
    item: Item<false>;
}

export const EditorPanel: FC<IDockviewPanelProps<EditorPanelProps>> = ({ params: { workspace, item } }) => {
    return <Document workspace={workspace} item={item} />;
};

const id = "editor";

export const makeEditorPanelOptions = (params: EditorPanelProps): AddPanelOptions => ({
    id: params.item.path,
    component: id,
    params,
});

const panel: PanelCollection<IDockviewPanelProps<EditorPanelProps>> = {
    [id]: withSuspense(EditorPanel),
};

export const editorPanel = { id, panel };
