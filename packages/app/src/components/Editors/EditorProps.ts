import { RichItem } from "@/atom/workspace";
import { Workspace } from "models";

export interface EditorProps {
    workspace: Workspace;
    item: RichItem<false>;
}
