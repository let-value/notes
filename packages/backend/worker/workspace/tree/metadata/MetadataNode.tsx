import { Item } from "models";
import { DirectoryNode } from "../fs/DirectoryNode";
import { TreeContext, TreeContextProps, TreeNode } from "../TreeNode";

interface MetadataNodeProps {
    item: Item<true>;
}

export const metadataPrefix = ".notes";

export class MetadataNode extends TreeNode<MetadataNodeProps> {
    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        const { item } = this.props;

        if (item.isDirectory) {
            return (
                <TreeContext.Provider value={this.newContext}>
                    <DirectoryNode item={item} />
                </TreeContext.Provider>
            );
        }

        return null;
    }
}
