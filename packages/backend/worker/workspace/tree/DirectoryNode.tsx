import { ReactiveComponentProperty } from "app/src/utils";
import { Item } from "models";
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
            combineLatest([this.items.pipeline, this.children]).pipe(
                map(([items, children]) => items.length === children.size),
                filter(Boolean),
            ),
        );
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
