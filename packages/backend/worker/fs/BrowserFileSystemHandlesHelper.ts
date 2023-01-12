import { Item } from "models";

export class BrowserFileSystemHandlesHelper {
    private handleLookup = new Map<string, FileSystemHandle>();

    get(item: Item) {
        return this.handleLookup.get(item.path);
    }

    getFile(item: Item<false>): FileSystemFileHandle {
        const handle = this.get(item);
        if (!(handle instanceof FileSystemFileHandle)) {
            throw new Error("Invalid handle");
        }
        return handle;
    }

    getDirectory(item: Item<true>): FileSystemDirectoryHandle {
        const handle = this.get(item);
        if (!(handle instanceof FileSystemDirectoryHandle)) {
            throw new Error("Invalid handle");
        }
        return handle;
    }

    set(item: Item, child: FileSystemHandle) {
        this.handleLookup.set(item.path, child);
    }

    indexFromTo(closestParent: Item<true>, item: Item<true>) {
        throw new Error("Method not implemented.");
    }

    async checkPermission(handle: FileSystemHandle, mode: FileSystemPermissionMode = "read"): Promise<void> {
        const permission = await handle.queryPermission({ mode });
        if (permission === "denied") {
            throw new Error("Permission denied");
        }

        if (permission === "prompt") {
            const newPermission = await handle.requestPermission({ mode });
            if (newPermission !== "granted") {
                throw new Error("Permission denied");
            }

            // const newPermission = await dispatcher.call(
            //     frontend.requestPermission,
            //     this.store.workspace.handle,
            //     undefined,
            //     query?.senderId,
            // );

            // if (newPermission !== "granted") {
            //     throw new Error("Permission denied");
            // }
        }
    }
}
