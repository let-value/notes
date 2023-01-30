import { PropsWithChildren } from "react";
import { DocumentNode } from "../fs/file/DocumentNode";
import { TreeContext, TreeContextProps } from "../TreeNode";

type LinksNodeProps = PropsWithChildren<unknown>;

export class LinksNode extends DocumentNode<LinksNodeProps> {
    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        const { children } = this.props;
        return <TreeContext.Provider value={this.newContext}>{children ?? null}</TreeContext.Provider>;
    }
}
