export class BrowserFileSystemHandlesHelper {
    private handleLookup = new Map<string, FileSystemHandle>();

    get(path: string) {
        return this.handleLookup.get(path);
    }

    getFile(path: string): FileSystemFileHandle {
        const handle = this.get(path);
        if (!(handle instanceof FileSystemFileHandle)) {
            throw new Error("Invalid handle");
        }
        return handle;
    }

    getDirectory(path: string): FileSystemDirectoryHandle {
        const handle = this.get(path);
        if (!(handle instanceof FileSystemDirectoryHandle)) {
            throw new Error("Invalid handle");
        }
        return handle;
    }

    getParent(path: string): FileSystemDirectoryHandle {
        throw new Error("Invalid handle");
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
