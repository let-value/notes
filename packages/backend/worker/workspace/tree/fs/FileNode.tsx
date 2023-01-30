import { createCachedSource, ReactiveComponentProperty } from "app/src/utils";
import { Item } from "models";
import { join } from "path";
import { BehaviorSubject, defer, map, shareReplay, switchMap } from "rxjs";
import { container } from "../../../container";

import { getLanguage } from "../../../utils/getLanguage";
import { getTokens } from "../../../utils/getTokens";
import { TreeNodeExtensions } from "../../TreeNodeExtensions";
import { BacklinksNode } from "../graph/BacklinksNode";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";
import { DirectoryNode } from "./DirectoryNode";
import { fileComponent } from "./file";

const queue = container.get("queue");

interface FileNodeProps {
    item: Item<false>;
}

export class FileNode extends TreeNode<FileNodeProps> {
    declare context: TreeContextProps<DirectoryNode>;
    language = getLanguage(this.props.item);

    item$ = new ReactiveComponentProperty(this, (props$) => props$.pipe(map((props) => props.item)));

    link$ = this.item$.pipeline$.pipe(
        switchMap((item) => defer(() => queue.add(() => this.context.root.registryRef.current.getLink(item)))),
        shareReplay(1, 0),
    );

    updateContent$ = new BehaviorSubject(null);

    content$ = createCachedSource(
        this.updateContent$.pipe(switchMap(() => defer(() => queue.add(() => this.readFile())))),
        1,
        100,
    );

    // tokens$ = new ReactiveComponentProperty(this, (props$) =>
    //     props$.pipe(
    //         map((props) => props.content),
    //         ,
    //     ),
    // );

    tokens$ = createCachedSource(
        defer(() => this.content$).pipe(switchMap((content) => queue.add(() => getTokens(this, content)))),
    );

    readFile() {
        console.log("readFile", this.props.item.path);
        return this.context.store.fs.readFile(this.props.item);
    }

    async writeFile(content: string) {
        await this.context.store.fs.writeFile(this.props.item, content);
        this.updateContent$.next(null);
    }

    async moveTo(targetPath: string) {
        const { item } = this.props;
        const targetDirectory = (await this.context.store.findNodeByPath(targetPath)) as DirectoryNode;
        const path = join(targetDirectory.props.item.path, item.name);
        await this.context.store.fs.moveFile(item, { ...item, path });

        await targetDirectory.refresh();
        await targetDirectory.deepReady;

        const newFile = await TreeNodeExtensions.findNodeByPath(targetDirectory, path);

        this.freezeChildren();

        await this.context.parent.refresh();
        this.context.root.updateLinks(this, newFile);
    }

    async copyTo(targetPath: string) {
        const { item } = this.props;
        const newDirectory = (await this.context.store.findNodeByPath(targetPath)) as DirectoryNode;

        await this.context.store.fs.copyFile(item, { ...item, path: join(newDirectory.props.item.path, item.name) });

        await newDirectory.refresh();
    }

    componentDidMount() {
        super.componentDidMount();
        this.context.root.registryRef.current?.addChildren(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.context.root.registryRef.current?.removeChildren(this);
    }

    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        const { item } = this.props;

        const Component = fileComponent[this.language];

        if (!Component) {
            return null;
        }

        return (
            <TreeContext.Provider value={this.newContext}>
                <Component key="component" {...item} language={this.language} />
                <BacklinksNode />
            </TreeContext.Provider>
        );
    }
}
