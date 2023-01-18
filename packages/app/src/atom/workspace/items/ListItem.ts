import { Item } from "models";

export interface ListItem<TDirectory extends boolean = any> extends Item<TDirectory> {
    new?: boolean;
    loading?: boolean;
    collapsed?: Item<true>[];
    depth: number;
}
