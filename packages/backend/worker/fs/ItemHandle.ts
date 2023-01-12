import { Item } from "models";

export interface ItemHandle<TDirectory extends boolean = any> extends Item<TDirectory> {
    handle: TDirectory extends true
        ? FileSystemDirectoryHandle
        : TDirectory extends false
        ? FileSystemFileHandle
        : FileSystemDirectoryHandle | FileSystemDirectoryHandle;
}
