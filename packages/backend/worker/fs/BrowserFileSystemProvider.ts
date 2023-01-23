/* eslint-disable @typescript-eslint/no-unused-vars */
import { incrementFileNameIfExist } from "app/src/utils";
import { DispatcherService, frontend } from "messaging";
import { FileProvider, Item, Workspace } from "models";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { addWorkspaceHandle, getWorkspaceHandle, getWorkspaceHandles } from "../db/repositories/workspaceHandles";
import { addWorkspace, getWorkspaces } from "../db/repositories/workspaces";
import { BrowserFileSystemHandlesHelper } from "./BrowserFileSystemHandlesHelper";
import { FileSystemProvider } from "./FileSystemProvider";

export class BrowserFileSystemProvider implements FileSystemProvider {
    handles = new BrowserFileSystemHandlesHelper();
    constructor(private dispatcher: DispatcherService) {}

    async openWorkspace(): Promise<Workspace> {
        const id = uuidv4();
        const handle = await this.dispatcher.call(frontend.pickDirectory, undefined);

        const workspaces = await getWorkspaces();
        const workspaceHandles = await getWorkspaceHandles();

        for (const workspace of workspaceHandles) {
            if (await workspace.handle.isSameEntry(handle)) {
                return workspace;
            }
        }

        const workspaceNames = workspaces.map((workspace) => workspace.name);
        const name = incrementFileNameIfExist(handle.name, workspaceNames);

        const workspace: Workspace = { id, name, provider: FileProvider.Local };
        await addWorkspace(workspace);
        await addWorkspaceHandle({ ...workspace, handle });

        return workspace;
    }

    async initializeWorkspace(workspace: Workspace): Promise<Item<true>> {
        const workspaceHandle = await getWorkspaceHandle(workspace.id);
        await this.handles.checkPermission(workspaceHandle.handle);

        const item = new Item(`/${workspace.id}`, workspace.name, true);
        this.handles.set(item.path, workspaceHandle.handle);

        return item;
    }

    async listDirectory(item: Item<true>): Promise<Item[]> {
        const handle = this.handles.getDirectory(item.path);
        await this.handles.checkPermission(handle);

        const items: Item[] = [];
        for await (const child of handle.values()) {
            const name = child.name;
            const childItem = new Item(path.resolve(item.path, name), name, child.kind === "directory");
            this.handles.set(childItem.path, child);
            items.push(childItem);
        }

        return items;
    }

    async createDirectory(item: Item<true>): Promise<void> {
        const handle = this.handles.getParent(item.path);
        await this.handles.checkPermission(handle, "readwrite");
        await handle.getDirectoryHandle(item.name, { create: true });
    }

    async renameDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deleteDirectory(item: Item<true>): Promise<void> {
        const handle = this.handles.getParent(item.path);
        await this.handles.checkPermission(handle, "readwrite");
        await handle.removeEntry(item.name);
    }

    async moveDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        return this.renameDirectory(oldItem, newItem);
    }

    async copyDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async writeFile(item: Item<false>, data: string): Promise<void> {
        let handle = this.handles.getFile(item.path);
        if (!handle) {
            const parent = this.handles.getParent(item.path);
            await this.handles.checkPermission(parent, "readwrite");

            handle = await parent.getFileHandle(item.name, { create: true });
            this.handles.set(item.path, handle);
        }

        await this.handles.checkPermission(handle, "readwrite");

        const stream = await handle.createWritable({ keepExistingData: false });
        await stream.write(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (stream as any).close();
    }

    async readFile(item: Item<false>): Promise<string> {
        const handle = this.handles.getFile(item.path);
        await this.handles.checkPermission(handle);

        const file = await handle.getFile();
        return await file.text();
    }

    async renameFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        await this.writeFile(newItem, await this.readFile(oldItem));
        await this.deleteFile(oldItem);
    }

    async deleteFile(item: Item<false>): Promise<void> {
        const handle = this.handles.getParent(item.path);
        await this.handles.checkPermission(handle, "readwrite");
        await handle.removeEntry(item.name);
    }

    async moveFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        return this.renameFile(oldItem, newItem);
    }

    async copyFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        await this.writeFile(newItem, await this.readFile(oldItem));
    }
}
