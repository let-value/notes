import { BroadcastMessage } from "messaging";
import { Item, ItemHandle } from "models";
import path from "path";
import { container } from "../container";
import { getItemsRecursively } from "./getItemsRecursively";
import { WorkspaceStore } from "./WorkspaceStore";

const queue = container.get("queue");

export class WorkspaceItemsHelper {
    files?: Item[];
    constructor(private store: WorkspaceStore) {}

    getWorkspaceItem(): ItemHandle<true> {
        const handle = this.store.workspace.handle;
        return { name: handle.name, path: "/", isDirectory: true, handle };
    }

    async getDirectoryItems(item: ItemHandle<true>): Promise<ItemHandle[]> {
        await this.store.permission.check();

        const items: ItemHandle[] = [];
        for await (const handle of item.handle.values()) {
            const name = handle.name;
            items.push({ name, path: path.resolve(item.path, name), isDirectory: handle.kind === "directory", handle });
        }

        return items;
    }

    /**
     * @deprecated use getItems instead
     * @param query
     * @returns
     */
    async getItems(query?: BroadcastMessage) {
        if (this.files) {
            return this.files;
        }

        await this.store.permission.check(query);

        const taskId = `${this.store.workspace.id}/getFiles`;
        const getFilesTask = async () => {
            const items: Item[] = [];
            for await (const [handle, parentPath] of getItemsRecursively(this.store.workspace.handle)) {
                items.push({ name: handle.name, path: parentPath, isDirectory: handle.kind === "directory" });
            }

            return items;
        };

        const files = await queue.add(getFilesTask, { priority: query ? 4 : 1, type: taskId });

        this.files = files;
        return files;
    }

    async readFile(item: ItemHandle<false>) {
        const taskId = `${this.store.workspace.id}/readFile/${item.name}`;
        const readFileTask = async () => {
            await this.store.permission.check();

            const file = await item.handle.getFile();
            return await file.text();
        };
        return await queue.add(readFileTask, { type: taskId });
    }
}
