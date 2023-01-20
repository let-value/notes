import { languages } from "lang-map";
import { Item } from "models";
import { extname } from "path";

export function getLanguage(item: Item): string {
    if (!item || item.isDirectory) {
        return undefined;
    }

    return languages(extname(item.path))?.[0];
}
