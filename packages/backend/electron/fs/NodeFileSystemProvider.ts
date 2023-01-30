import { incrementFileNameIfExist } from "app/src/utils";
import { addWorkspace, getWorkspaces } from "backend-worker/db/repositories/workspaces";
import { FileSystemProvider } from "backend-worker/fs/FileSystemProvider";
import fsAsync from "fs/promises";
import { openDialog } from "notes-electron/packages/renderer/src/controllers/openDialog/query";

import { DispatcherService } from "messaging";
import { FileProvider, Item, Workspace } from "models";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { addWorkspaceHandle, getWorkspaceHandle, getWorkspaceHandles } from "../db/repositories";

export class NodeFileSystemProvider implements FileSystemProvider {
    constructor(private dispatcher: DispatcherService) {}
    async openWorkspace(): Promise<Workspace> {
        const id = uuidv4();
        const result = await this.dispatcher.call(openDialog, {
            properties: ["openDirectory"],
        });
        const filePath = result.filePaths[0].replace(/\\/g, "/");

        const workspaces = await getWorkspaces();
        const workspaceHandles = await getWorkspaceHandles();

        for (const workspace of workspaceHandles) {
            if (workspace.path == filePath) {
                return workspace;
            }
        }

        const workspaceNames = workspaces.map((workspace) => workspace.name);
        const name = incrementFileNameIfExist(path.basename(filePath), workspaceNames);

        const workspace: Workspace = { id, name, provider: FileProvider.Local };
        await addWorkspace(workspace);
        await addWorkspaceHandle({ ...workspace, path: filePath });

        return workspace;
    }

    async initializeWorkspace(workspace: Workspace): Promise<Item<true>> {
        const workspaceHandle = await getWorkspaceHandle(workspace.id);

        if (!workspaceHandle) {
            throw new Error(`Workspace ${workspace.name} not found`);
        }

        return new Item(workspaceHandle.path, workspace.name, true);
    }

    async listDirectory(item: Item<true>): Promise<Item[]> {
        const names = await fsAsync.readdir(item.path, { withFileTypes: true });
        return names.map((entry) => new Item(path.join(item.path, entry.name), entry.name, entry.isDirectory()));
    }

    createDirectory(item: Item<true>): Promise<void> {
        return fsAsync.mkdir(item.path);
    }

    renameDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        return fsAsync.rename(oldItem.path, newItem.path);
    }

    deleteDirectory(item: Item<true>): Promise<void> {
        return fsAsync.rmdir(item.path);
    }

    moveDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        return this.renameDirectory(oldItem, newItem);
    }

    async copyDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        return fsAsync.cp(oldItem.path, newItem.path, { recursive: true });
    }

    writeFile(item: Item<false>, data: any): Promise<void> {
        return fsAsync.writeFile(item.path, data);
    }

    async readFile(item: Item<false>): Promise<string> {
        const buffer = await fsAsync.readFile(item.path);
        return buffer.toString();
    }

    renameFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        return fsAsync.rename(oldItem.path, newItem.path);
    }

    deleteFile(item: Item<false>): Promise<void> {
        return fsAsync.unlink(item.path);
    }

    moveFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        return this.renameFile(oldItem, newItem);
    }

    copyFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        return fsAsync.copyFile(oldItem.path, newItem.path);
    }
}
