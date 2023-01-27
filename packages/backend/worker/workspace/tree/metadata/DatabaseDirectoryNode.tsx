import { ReactiveComponentProperty } from "app/src/utils";
import { filter, firstValueFrom, from, map, switchMap, tap } from "rxjs";
import { DirectoryNode } from "../fs/DirectoryNode";
import { FileNode } from "../fs/FileNode";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";
import { MetadataNode } from "./MetadataNode";

export const directoryName = "database";

export class MetadataDirectoryNode extends TreeNode {
    declare context: TreeContextProps<MetadataNode>;

    directory$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            switchMap(() => this.context.parent.directory$.pipeline$),
            switchMap((directory) => directory?.children$ ?? from([null])),
            map(
                (children) =>
                    (children?.find(
                        (x) => x instanceof DirectoryNode && x.props.item.name === directoryName,
                    ) as DirectoryNode) ?? null,
            ),
        ),
    );

    getDirectory$ = this.directory$.pipeline$.pipe(
        tap((directory) => {
            if (directory === null) {
                firstValueFrom(this.context.parent.getDirectory$).then((parentDirectory) =>
                    parentDirectory?.createDirectory(directoryName),
                );
            }
        }),
    );

    async getFile(name: string) {
        const normalizedName = name.toLowerCase().replaceAll(" ", "_").replaceAll("/", "_").replaceAll("\\", "_");

        const directory = await firstValueFrom(this.getDirectory$.pipe(filter((x) => x !== null)));
        const file = await firstValueFrom(
            directory.children$.pipe(
                map(
                    (children) =>
                        (children.find(
                            (x) => x instanceof FileNode && x.props.item.name === normalizedName,
                        ) as FileNode) ?? null,
                ),
                tap((file) => {
                    if (file === null) {
                        directory?.createFile(normalizedName);
                    }
                }),
                filter((x) => x !== null),
            ),
        );

        return file;
    }

    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        const directory = this.directory$.value;

        if (!directory) {
            return null;
        }

        return <TreeContext.Provider value={this.newContext}></TreeContext.Provider>;
    }
}
