import { ReactiveComponentProperty } from "app/src/utils";
import { Item } from "models";
import { join } from "path";
import { combineLatest, filter, firstValueFrom, map, mergeMap } from "rxjs";
import { FileNode } from "./FileNode";
import { TreeContext, TreeNode } from "./TreeItemNode";

interface DirectoryNodeProps {
    item: Item<true>;
}

export class DirectoryNode extends TreeNode<DirectoryNodeProps> {
    items = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.item),
            mergeMap((item) => this.context.store.fs.listDirectory(item)),
        ),
    );

    get ready() {
        return firstValueFrom(
            combineLatest([this.items.pipeline$, this.children]).pipe(
                map(([items, children]) => items.length === children.size),
                filter(Boolean),
            ),
        );
    }

    async createFile(name: string) {
        const item = new Item<false>(join(this.props.item.path, name), name, false);
        await this.context.store.fs.writeFile(item, "");
        return await this.items.update();
    }

    async createDirectory(name: string) {
        const item = new Item<true>(join(this.props.item.path, name), name, true);
        await this.context.store.fs.createDirectory(item);
        return await this.items.update();
    }

    render() {
        const { store } = this.context;

        return (
            <TreeContext.Provider value={{ store, parent: this }}>
                {this.items.value?.map((child) => {
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
