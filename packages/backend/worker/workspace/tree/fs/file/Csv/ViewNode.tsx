import { ReactNode } from "react";
import { TreeNode } from "../../../TreeNode";
import { DatabaseView } from "./utils";

interface ViewNodeProps {
    view: DatabaseView;
}

export class ViewNode extends TreeNode<ViewNodeProps> {
    render(): ReactNode {
        return null;
    }
}
