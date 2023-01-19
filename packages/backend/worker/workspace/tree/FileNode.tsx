import { Item } from "models";

import { getLanguage } from "../../utils/getLanguage";
import { fileComponent } from "./file";
import { TreeContext, TreeNode } from "./TreeNode";

interface FileNodeProps {
    item: Item<false>;
}

export class FileNode extends TreeNode<FileNodeProps> {
    language: string;
    constructor(props) {
        super(props);
        this.language = getLanguage(props.item);
    }

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

    render() {
        const { item } = this.props;
        const { store } = this.context;

        const Component = fileComponent[this.language];

        if (!Component) {
            return null;
        }

        return (
            <TreeContext.Provider value={{ store, parent: this }}>
                <Component {...item} language={this.language} />
            </TreeContext.Provider>
        );
    }
}
