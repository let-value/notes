import { ReactiveComponentProperty } from "app/src/utils";
import { backend } from "messaging";
import { Item } from "models";
import { join } from "path";
import { combineLatest, map, mergeMap } from "rxjs";
import { container } from "../../../container";
import { MetadataNode, metadataPrefix } from "../metadata/MetadataNode";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";
import { FileNode } from "./FileNode";

interface DirectoryNodeProps {
    item: Item<true>;
}

const dispatcher = container.get("dispatcher");

export class DirectoryNode extends TreeNode<DirectoryNodeProps> {
    declare context: TreeContextProps<DirectoryNode>;

    items = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.item),
            mergeMap((item) => this.context.store.fs.listDirectory(item)),
        ),
    );

    ready$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            mergeMap(() =>
                combineLatest([this.items.pipeline$, this.children$]).pipe(
                    map(([items, children]) => items.length === children.length),
                ),
            ),
        ),
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
        const items = await this.items.update();
        await dispatcher.send(
            backend.workspace.items.response(items, undefined, {
                workspaceId: this.context.store.workspace.id,
                path: this.props.item.path,
            }),
        );
    }

    async moveTo(targetPath: string) {
        const { item } = this.props;
        const newDirectory = (await this.context.store.findNodeByPath(targetPath)) as DirectoryNode;

        await this.context.store.fs.moveDirectory(item, {
            ...item,
            path: join(newDirectory.props.item.path, item.name),
        });

        await this.context.parent.refresh();
        await newDirectory.refresh();
    }

    async copyTo(targetPath: string) {
        const { item } = this.props;
        const newDirectory = (await this.context.store.findNodeByPath(targetPath)) as DirectoryNode;

        await this.context.store.fs.copyDirectory(item, {
            ...item,
            path: join(newDirectory.props.item.path, item.name),
        });

        await newDirectory.refresh();
    }

    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        return (
            <TreeContext.Provider value={this.newContext}>
                {this.items.value?.map((child) => {
                    if (child.name.startsWith(metadataPrefix)) {
                        return <MetadataNode key={child.path} item={child} />;
                    }

                    if (child.isDirectory) {
                        return <DirectoryNode key={child.path} item={child} />;
                    } else {
                        return <FileNode key={child.path} item={child} />;
                    }
                })}
            </TreeContext.Provider>
        );
    }
}
