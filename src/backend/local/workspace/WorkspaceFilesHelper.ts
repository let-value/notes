import { Item } from "@/domain";
import { BroadcastMessage } from "@/messaging";
import { queue } from "@/queue/queue";
import { pendingPromise } from "@/utils";
import path from "path";
import { getItemsRecursively } from "./getItemsRecursively";
import { WorkspaceStore } from "./WorkspaceStore";

export class WorkspaceFilesHelper {
    files?: Item[];
    constructor(private store: WorkspaceStore) {}

    @pendingPromise()
    async getFiles(query?: BroadcastMessage) {
        if (this.files) {
            return this.files;
        }

        await this.store.permission.check(query);

        const files = await queue.add(
            async () => {
                const items: Item[] = [];
                for await (const [handle, parentPath] of getItemsRecursively(this.store.workspace.handle)) {
                    items.push({ name: handle.name, path: parentPath, isDirectory: handle.kind === "directory" });
                }

                return items;
            },
            { priority: 4 },
        );

        this.files = files;
        return files;
    }

    @pendingPromise()
    async readFile(payload: string, query?: BroadcastMessage) {
        await this.store.permission.check(query);

        return await queue.add(
            async () => {
                await this.store.permission.check(query);

                const parsedPath = path.parse(payload);

                const folders = parsedPath.dir.split(path.sep).filter((dir) => dir !== "");

                let directoryHandle = this.store.workspace.handle as FileSystemDirectoryHandle;
                while (folders.length > 0) {
                    const dir = folders.shift();

                    if (!dir) {
                        continue;
                    }

                    directoryHandle = await directoryHandle.getDirectoryHandle(dir);
                }

                const fileHandle = await directoryHandle.getFileHandle(parsedPath.base);
                const file = await fileHandle.getFile();
                return await file.text();
            },
            { priority: 4 },
        );
    }
}
