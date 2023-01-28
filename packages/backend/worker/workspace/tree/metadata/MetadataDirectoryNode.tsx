import { ReactiveComponentProperty } from "app/src/utils";
import { format } from "path";
import { PropsWithChildren } from "react";
import { filter, firstValueFrom, map, switchMap, tap } from "rxjs";
import { DirectoryNode } from "../fs/DirectoryNode";
import { FileNode } from "../fs/FileNode";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";
import { MetadataNode } from "./MetadataNode";

interface MetadataDirectoryProps {
    name: string;
}

export class MetadataDirectoryNode extends TreeNode<PropsWithChildren<MetadataDirectoryProps>> {
    declare context: TreeContextProps<MetadataNode>;

    directory$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            switchMap(() => this.context.parent.getMetaDirectory$),
            switchMap((directory) =>
                directory.ready$.pipe(
                    filter((x) => x),
                    map(() => directory),
                ),
            ),
            filter((x) => x !== null),
            switchMap((directory) =>
                directory.children$.pipe(
                    map(
                        (children) =>
                            (children?.find(
                                (x) => x instanceof DirectoryNode && x.props.item.name === this.props.name,
                            ) as DirectoryNode) ?? null,
                    ),
                ),
            ),
        ),
    );

    getDirectory$ = this.directory$.pipeline$.pipe(
        tap((directory) => {
            if (directory === null) {
                firstValueFrom(this.context.parent.getMetaDirectory$.pipe(filter((x) => x !== null))).then(
                    (parentDirectory) => {
                        parentDirectory?.createDirectory(this.props.name);
                    },
                );
            }
        }),
    );

    async getFile(name: string) {
        const normalizedName = name.toLowerCase().replaceAll(" ", "_").replaceAll("/", "_").replaceAll("\\", "_");

        const fileName = format({
            name: normalizedName,
            ext: ".json",
        });

        const directory = await firstValueFrom(this.getDirectory$.pipe(filter((x) => x !== null)));
        const file = await firstValueFrom(
            directory.ready$.pipe(
                filter((x) => x),
                switchMap(() => directory.children$),
                map(
                    (children) =>
                        (children.find((x) => x instanceof FileNode && x.props.item.name === fileName) as FileNode) ??
                        null,
                ),
                tap((file) => {
                    if (file === null) {
                        directory?.createFile(fileName);
                    }
                }),
                filter((x) => x !== null),
            ),
        );

        return file;
    }

    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        const { children } = this.props;
        const directory = this.directory$.value;

        if (!directory) {
            return null;
        }

        return <TreeContext.Provider value={this.newContext}>{children}</TreeContext.Provider>;
    }
}
