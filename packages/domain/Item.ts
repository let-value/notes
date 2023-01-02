export interface Item {
    path: string;
    name: string;
    isDirectory: boolean;
}

export interface TreeItem extends Item {
    children?: TreeItem[];
}
