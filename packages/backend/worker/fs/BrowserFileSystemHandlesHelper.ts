import { dirname } from "path";

export class BrowserFileSystemHandlesHelper {
    private handleLookup = new Map<string, FileSystemHandle>();

    get(path: string) {
        return this.handleLookup.get(path);
    }

    getFile(path: string): FileSystemFileHandle | undefined {
        const handle = this.get(path);
        if (handle && !(handle instanceof FileSystemFileHandle)) {
            throw new Error("Invalid handle");
        }
        return handle as FileSystemFileHandle;
    }

    getDirectory(path: string): FileSystemDirectoryHandle | undefined {
        const handle = this.get(path);
        if (handle && !(handle instanceof FileSystemDirectoryHandle)) {
            throw new Error("Invalid handle");
        }
        return handle as FileSystemDirectoryHandle;
    }

    getParent(path: string): FileSystemDirectoryHandle {
        const parent = dirname(path);
        return this.getDirectory(parent);
    }

    set(path: string, child: FileSystemHandle) {
        this.handleLookup.set(path, child);
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
