import { incrementFileNameIfExist } from "app/src/utils";
import { DispatcherService, frontend } from "messaging";
import { Item, Workspace } from "models";
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

        const workspace: Workspace = { id, name };
        await addWorkspace(workspace);
        await addWorkspaceHandle({ ...workspace, handle });

        return workspace;
    }

    async initializeWorkspace(workspace: Workspace): Promise<Item<true>> {
        const workspaceHandle = await getWorkspaceHandle(workspace.id);
        await this.handles.checkPermission(workspaceHandle.handle);

        const item = new Item(`/${workspace.id}`, workspace.name, true);
        this.handles.set(item, workspaceHandle.handle);

        return item;
    }

    async listDirectory(item: Item<true>): Promise<Item[]> {
        const handle = this.handles.getDirectory(item);
        await this.handles.checkPermission(handle);

        const items: Item[] = [];
        for await (const child of handle.values()) {
            const name = child.name;
            const childItem = new Item(path.resolve(item.path, name), name, child.kind === "directory");
            this.handles.set(childItem, child);
            items.push(childItem);
        }

        return items;
    }

    async createDirectory(item: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async renameDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deleteDirectory(item: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async moveDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async copyDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createFile(item: Item<false>, data: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async readFile(item: Item<false>): Promise<string> {
        const handle = this.handles.getFile(item);
        await this.handles.checkPermission(handle);

        const file = await handle.getFile();
        return await file.text();
    }

    async renameFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deleteFile(item: Item<false>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async moveFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async copyFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
