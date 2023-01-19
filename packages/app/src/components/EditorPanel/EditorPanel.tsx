import { AddPanelOptions, IDockviewPanelProps, PanelCollection } from "dockview";
import { FC, Suspense } from "react";
import { Document } from "../Document/Document";
import { EditorPanelProps } from "./EditorPanelProps";
import { editorTab } from "./EditorTab";

export const EditorPanel: FC<IDockviewPanelProps<EditorPanelProps>> = ({ params: { workspace, item } }) => {
    return (
        <Suspense>
            <Document workspace={workspace} item={item} />
        </Suspense>
    );
};

const id = "editor";

export const makeEditorPanelOptions = (params: EditorPanelProps): AddPanelOptions => ({
    id: params.item.path,
    component: id,
    params,
    tabComponent: editorTab.id,
});

const collection: PanelCollection<IDockviewPanelProps<EditorPanelProps>> = {
    [id]: EditorPanel,
};

export const editorPanel = { id, collection };