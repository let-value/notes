import { ReactiveComponentProperty } from "app/src/utils";
import { createRef } from "react";
import { filter, map, switchMap, tap } from "rxjs";
import { DirectoryNode } from "../fs/DirectoryNode";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";
import { MetadataDirectoryNode } from "./DatabaseDirectoryNode";

export const metadataPrefix = ".notes";

export class MetadataNode extends TreeNode {
    declare context: TreeContextProps<DirectoryNode>;
    directory$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            switchMap(() => this.context.parent.ready$.pipeline$),
            filter((x) => x === true),
            switchMap(() => this.context.parent.children$),
            map(
                (children) =>
                    (children.find(
                        (x) => x instanceof DirectoryNode && x.props.item.name === metadataPrefix,
                    ) as DirectoryNode) ?? null,
            ),
        ),
    );

    getDirectory$ = this.directory$.pipeline$.pipe(
        tap((directory) => {
            if (directory === null) {
                this.context.parent.createDirectory(metadataPrefix);
            }
        }),
    );

    databaseRef = createRef<MetadataDirectoryNode>();

    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        return (
            <TreeContext.Provider value={this.newContext}>
                <MetadataDirectoryNode ref={this.databaseRef} />
            </TreeContext.Provider>
        );
    }
}
