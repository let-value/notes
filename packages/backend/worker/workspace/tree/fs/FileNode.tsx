import { Item } from "models";
import { join } from "path";

import { getLanguage } from "../../../utils/getLanguage";
import { TreeNodeExtensions } from "../../TreeNodeExtensions";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";
import { DirectoryNode } from "./DirectoryNode";
import { fileComponent } from "./file";
import { FileContentNode } from "./file/FileContentNode";

interface FileNodeProps {
    item: Item<false>;
}

export class FileNode extends TreeNode<FileNodeProps> {
    declare context: TreeContextProps<DirectoryNode>;
    language = getLanguage(this.props.item);

    readFile() {
        return this.context.store.fs.readFile(this.props.item);
    }

    async writeFile(content: string) {
        await this.context.store.fs.writeFile(this.props.item, content);
        (await TreeNodeExtensions.findNodeByType(this, FileContentNode))?.content$.update();
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
        this.context.root.registry.current?.addChildren(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.context.root.registry.current?.removeChildren(this);
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
            </TreeContext.Provider>
        );
    }
}
