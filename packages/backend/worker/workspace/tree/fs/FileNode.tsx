import { Item } from "models";
import { join } from "path";

import { getLanguage } from "../../../utils/getLanguage";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";
import { DirectoryNode } from "./DirectoryNode";
import { fileComponent } from "./file";

interface FileNodeProps {
    item: Item<false>;
}

export class FileNode extends TreeNode<FileNodeProps> {
    declare context: TreeContextProps<DirectoryNode>;
    language = getLanguage(this.props.item);

    readFile() {
        return this.context.store.fs.readFile(this.props.item);
    }

    writeFile(content: string) {
        return this.context.store.fs.writeFile(this.props.item, content);
    }

    async moveTo(targetPath: string) {
        const { item } = this.props;
        const newDirectory = (await this.context.store.findNodeByPath(targetPath)) as DirectoryNode;

        await this.context.store.fs.moveFile(item, { ...item, path: join(newDirectory.props.item.path, item.name) });

        await this.context.parent.refresh();
        await newDirectory.refresh();
    }

    async copyTo(targetPath: string) {
        const { item } = this.props;
        const newDirectory = (await this.context.store.findNodeByPath(targetPath)) as DirectoryNode;

        await this.context.store.fs.copyFile(item, { ...item, path: join(newDirectory.props.item.path, item.name) });

        await newDirectory.refresh();
    }

    componentDidMount() {
        super.componentDidMount();
        this.context.root.registry.current?.addFile(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.context.root.registry.current?.removeFile(this);
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
