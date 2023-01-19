import { Item } from "models";

import { getLanguage } from "../../utils/getLanguage";
import { fileComponent } from "./file";
import { TreeContext, TreeContextProps, TreeNode } from "./TreeNode";

interface FileNodeProps {
    item: Item<false>;
}

export class FileNode extends TreeNode<FileNodeProps> {
    language = getLanguage(this.props.item);

    readFile() {
        return this.context.store.fs.readFile(this.props.item);
    }

    writeFile(content: string) {
        return this.context.store.fs.writeFile(this.props.item, content);
    }

    componentDidMount() {
        super.componentDidMount();
        this.context.store.registry.lastValue.then((registry) => registry.addFile(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.context.store.registry.lastValue.then((registry) => registry.removeFile(this));
    }

    newContext: TreeContextProps = { store: this.context.store, parent: this };

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
