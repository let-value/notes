import { ReactiveComponentProperty } from "app/src/utils";
import { Item } from "models";
import { dirname, parse, resolve } from "path";
import { BehaviorSubject, filter, firstValueFrom, map, mergeMap } from "rxjs";
import { FileNode } from "./FileNode";
import { TreeContextProps, TreeNode } from "./TreeNode";
import { WorkspaceNode } from "./WorkspaceNode";

export class FileRegistryNode extends TreeNode {
    declare context: TreeContextProps<WorkspaceNode>;
    files = new BehaviorSubject(new Set<FileNode>());
    addFile(node: FileNode) {
        const files = new Set(this.files.getValue());
        files.add(node);
        this.files.next(files);
    }

    removeFile(node: FileNode) {
        const files = new Set(this.files.getValue());
        files.delete(node);
        this.files.next(files);
    }

    componentDidMount() {
        super.componentDidMount();
        this.context.store.registry.next(this);
    }

    deepReady$ = new ReactiveComponentProperty(this, (props$) => props$.pipe(map(() => true)));

    get deepReady() {
        return firstValueFrom(this.deepReady$.pipeline$.pipe(filter((ready) => ready)));
    }

    registry = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            mergeMap(() => this.files),
            map((files) => Array.from(files.values())),
            map((files) => files.map((file) => ({ params: parse(file.props.item.path), item: file.props.item }))),
        ),
    );

    async resolveLink(origin: Item<false>, path: string) {
        await this.context.parent.deepReady;

        const info = parse(path);
        const sameName = this.registry.value.filter(
            (x) =>
                x.params.name === info.name &&
                (info.ext ? x.params.ext === info.ext : true) &&
                x.item.path !== origin.path,
        );

        if (sameName.length === 0) {
            return undefined;
        }

        if (sameName.length === 1) {
            return sameName[0].item;
        }

        const absolute = sameName.find((x) => x.params.dir === info.dir);
        if (absolute) {
            return absolute.item;
        }

        const resolvedPath = resolve(dirname(origin.path), info.dir);
        const relative = sameName.find((x) => x.params.dir.endsWith(resolvedPath));
        if (relative) {
            return relative.item;
        }

        const lastSegment = sameName.find((x) => x.params.dir.endsWith(info.name));
        if (lastSegment) {
            return lastSegment.item;
        }

        return undefined;
    }

    render() {
        return null;
    }
}
