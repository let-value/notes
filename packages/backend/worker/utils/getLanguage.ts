import { filename } from "language-detect";
import map from "language-map";
import { TreeItem } from "models";

export function getLanguage(tree: TreeItem): string {
    if (!tree || tree.isDirectory) {
        return undefined;
    }

    const detected: any = filename(tree.name);
    return (map as any)[detected]?.aceMode;
}
