import { AddPanelOptions, IDockviewPanelProps, PanelCollection } from "dockview";
import { FC } from "react";
import { Document } from "../Document/Document";
import { withSuspense } from "../withSuspense";
import { EditorPanelProps } from "./EditorPanelProps";
import { editorTab } from "./EditorTab";

export const EditorPanel: FC<IDockviewPanelProps<EditorPanelProps>> = ({ params: { workspace, item } }) => {
    return <Document workspace={workspace} item={item} />;
};

const id = "editor";

export const makeEditorPanelOptions = (params: EditorPanelProps): AddPanelOptions => ({
    id: params.item.path,
    component: id,
    params,
    tabComponent: editorTab.id,
});

const collection: PanelCollection<IDockviewPanelProps<EditorPanelProps>> = {
    [id]: withSuspense(EditorPanel),
};

export const editorPanel = { id, collection };
