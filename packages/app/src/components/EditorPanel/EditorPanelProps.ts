import { ListItem } from "@/atom/workspace";
import { Workspace } from "models";

export interface EditorPanelProps {
    workspace: Workspace;
    item: ListItem<false>;
}
