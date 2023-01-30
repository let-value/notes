import { createReplaySubject, ReactiveComponentProperty } from "app/src/utils";
import { backend } from "messaging";
import { Item } from "models";
import { join } from "path";
import { ReactNode } from "react";
import { combineLatest, filter, map, switchMap } from "rxjs";
import { container } from "../../../container";
import { TreeNodeExtensions } from "../../TreeNodeExtensions";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";
import { FileNode } from "./FileNode";

interface DirectoryNodeProps {
    item?: Item<true>;
    children?: ReactNode;
}

const dispatcher = container.get("dispatcher");
const queue = container.get("queue");

export class DirectoryNode extends TreeNode<DirectoryNodeProps> {
    declare context: TreeContextProps<DirectoryNode>;

    items$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.item),
            filter((item) => item !== undefined),
            switchMap((item) => queue.add(() => this.context.store.fs.listDirectory(item))),
        ),
    );

    ready$ = createReplaySubject(
        combineLatest([this.items$.pipeline$, this.children$]).pipe(
            map(([items, children]) => children.length >= items?.length),
        ),
        1,
    );

    async createFile(name: string) {
        const item = new Item<false>(join(this.props.item.path, name), name, false);
        await this.context.store.fs.writeFile(item, "");
        await this.refresh();
    }

    async createDirectory(name: string) {
        const item = new Item<true>(join(this.props.item.path, name), name, true);
        await this.context.store.fs.createDirectory(item);
        await this.refresh();
    }

    async refresh() {
        const items = await this.items$.update();
        await dispatcher.send(
            backend.workspace.items.response(items, undefined, {
                workspaceId: this.context.store.workspace.id,
                path: this.props.item.path,
            }),
        );
        return items;
    }

    async moveTo(targetPath: string) {
        const { item } = this.props;
        const targetDirectory = (await this.context.store.findNodeByPath(targetPath)) as DirectoryNode;

        const path = join(targetDirectory.props.item.path, item.name);

        await this.context.store.fs.moveDirectory(item, {
            ...item,
            path,
        });

        await targetDirectory.refresh();
        await targetDirectory.deepReady;

        const newDirectory = await TreeNodeExtensions.findNodeByPath(targetDirectory, path);

        this.freezeChildren();
        await this.context.parent.refresh();

        this.context.root.updateLinks(this, newDirectory);
    }

    async copyTo(targetPath: string) {
        const { item } = this.props;
        const targetDirectory = (await this.context.store.findNodeByPath(targetPath)) as DirectoryNode;

        await this.context.store.fs.copyDirectory(item, {
            ...item,
            path: join(targetDirectory.props.item.path, item.name),
        });

        await targetDirectory.refresh();
    }

    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        const { children } = this.props;
        return (
            <TreeContext.Provider value={this.newContext}>
                {this.items$.value?.map((child) => {
                    if (child.isDirectory) {
                        return <DirectoryNode key={child.path} item={child} />;
                    } else {
                        return <FileNode key={child.path} item={child} />;
                    }
                })}
                {children}
            </TreeContext.Provider>
        );
    }
}
