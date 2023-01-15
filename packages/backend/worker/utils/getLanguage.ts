import { Item } from "models";

export function getLanguage(tree: Item): string {
    if (!tree || tree.isDirectory) {
        return undefined;
    }

    return "markdown";
}
