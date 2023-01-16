import { Item, Workspace } from "models";

export interface EditorPanelProps {
    workspace: Workspace;
    item: Item<false>;
}
