import { Item } from "models";
import { fileComponent } from "../../components/Document";
import { getLanguage } from "../../utils/getLanguage";
import { TreeContext, TreeNode } from "./TreeItemNode";

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
