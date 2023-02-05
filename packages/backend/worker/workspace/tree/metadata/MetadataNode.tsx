import { tapOnce } from "app/src/utils";
import { createRef } from "react";
import { filter, map, shareReplay, switchMap } from "rxjs";
import { DirectoryNode } from "../fs/DirectoryNode";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";
import { MetadataDirectoryNode } from "./MetadataDirectoryNode";

export const metadataPrefix = ".notes";

export class MetadataNode extends TreeNode {
    declare context: TreeContextProps<DirectoryNode>;

    getMetaDirectory$ = this.context.parent.ready$.pipe(
        filter((x) => x === true),
        switchMap(() => this.context.parent.children$),
        map(
            (children) =>
                (children.find(
                    (x) => x instanceof DirectoryNode && x.props.item.name === metadataPrefix,
                ) as DirectoryNode) ?? null,
        ),
        tapOnce((directory) => {
            if (directory === null) {
                this.context.parent.createDirectory(metadataPrefix);
            }
        }),
        shareReplay(1),
    );

    databaseRef = createRef<MetadataDirectoryNode>();

    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        return (
            <TreeContext.Provider value={this.newContext}>
                <MetadataDirectoryNode ref={this.databaseRef} name="database" />
            </TreeContext.Provider>
        );
    }
}
