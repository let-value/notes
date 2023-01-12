import { Item, Workspace } from "models";

export interface FileSystemProvider {
    openWorkspace(): Promise<Workspace>;
    initializeWorkspace(workspace: Workspace): Promise<Item<true>>;
    listDirectory(item: Item<true>): Promise<Item[]>;
    createDirectory(item: Item<true>): Promise<void>;
    renameDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void>;
    deleteDirectory(item: Item<true>): Promise<void>;
    moveDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void>;
    copyDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void>;
    createFile(item: Item<false>, data: any): Promise<void>;
    readFile(item: Item<false>): Promise<string>;
    renameFile(oldItem: Item<false>, newItem: Item<false>): Promise<void>;
    deleteFile(item: Item<false>): Promise<void>;
    moveFile(oldItem: Item<false>, newItem: Item<false>): Promise<void>;
    copyFile(oldItem: Item<false>, newItem: Item<false>): Promise<void>;
}
