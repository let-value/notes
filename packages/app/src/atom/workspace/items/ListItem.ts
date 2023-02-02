import { RichItem } from "./workspaceItemsSelector";

export interface ListItem<TDirectory extends boolean = any> extends RichItem<TDirectory> {
    new?: boolean;
    loading?: boolean;
    collapsed?: ListItem<true>[];
    depth: number;
    parents: ListItem<false>[];
}
