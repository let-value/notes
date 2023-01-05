import { ItemHandle } from "models";
import { memo, useContext, useMemo } from "react";
import { getLanguage } from "../../utils/getLanguage";
import { fileComponent } from "../Document";
import { TreeContext } from "../TreeContext";
import { TreeNode } from "../TreeNode";

export class TreeFileNode extends TreeNode {
    constructor(public language: string, item: ItemHandle, parent?: TreeNode) {
        super(item, parent);
    }
}

export const File = memo(function File(item: ItemHandle<false>) {
    const parent = useContext(TreeContext);
    const language = useMemo(() => getLanguage(item), [item]);
    const instance = useMemo(() => new TreeFileNode(language, item, parent), [item, language, parent]);

    const Component = fileComponent[language];

    if (!Component) {
        return null;
    }

    return (
        <TreeContext.Provider value={instance}>
            <Component {...item} language={language} />
        </TreeContext.Provider>
    );
});
