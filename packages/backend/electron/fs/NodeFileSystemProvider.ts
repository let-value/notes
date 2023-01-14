import { incrementFileNameIfExist } from "app/src/utils";
import { addWorkspace, getWorkspaces } from "backend-worker/db/repositories/workspaces";
import { FileSystemProvider } from "backend-worker/fs/FileSystemProvider";
import * as fs from "fs";
import { openDialog } from "notes-electron/packages/renderer/src/controllers/openDialog";

import { DispatcherService } from "messaging";
import { FileProvider, Item, Workspace } from "models";
import * as path from "path";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import { addWorkspaceHandle, getWorkspaceHandle, getWorkspaceHandles } from "../db/repositories";

export class NodeFileSystemProvider implements FileSystemProvider {
    constructor(private dispatcher: DispatcherService) {}
    async openWorkspace(): Promise<Workspace> {
        const id = uuidv4();
        const result = await this.dispatcher.call(openDialog, {
            properties: ["openDirectory"],
        });
        const filePath = result.filePaths[0];

        const workspaces = await getWorkspaces();
        const workspaceHandles = await getWorkspaceHandles();

        for (const workspace of workspaceHandles) {
            if (workspace.path == filePath) {
                return workspace;
            }
        }

        const workspaceNames = workspaces.map((workspace) => workspace.name);
        const name = incrementFileNameIfExist(path.dirname(filePath), workspaceNames);

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
        const readdir = promisify(fs.readdir);
        const names = await readdir(item.path, { withFileTypes: true });
        return names.map(({ name, isDirectory }) => new Item(path.resolve(item.path, name), name, isDirectory()));
    }

    createDirectory(item: Item<true>): Promise<void> {
        const mkdir = promisify(fs.mkdir);
        return mkdir(item.path);
    }

    renameDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        const rename = promisify(fs.rename);
        return rename(oldItem.path, newItem.path);
    }

    deleteDirectory(item: Item<true>): Promise<void> {
        const rmdir = promisify(fs.rmdir);
        return rmdir(item.path);
    }

    moveDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        return this.renameDirectory(oldItem, newItem);
    }

    async copyDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        const newDirectory = await this.createDirectory(newItem);
        //TODO: Copy files
        // const files = await this.listDirectory(oldPath);
        // for (const file of files) {
        //     await this.copyFile(`${oldPath}/${file}`, `${newPath}/${file}`);
        // }
        return newDirectory;
    }

    createFile(item: Item<false>, data: any): Promise<void> {
        const writeFile = promisify(fs.writeFile);
        return writeFile(item.path, data);
    }
    async readFile(item: Item<false>): Promise<string> {
        const readFile = promisify(fs.readFile);
        const buffer = await readFile(item.path);
        return buffer.toString();
    }

    renameFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        const rename = promisify(fs.rename);
        return rename(oldItem.path, newItem.path);
    }

    deleteFile(item: Item<false>): Promise<void> {
        const unlink = promisify(fs.unlink);
        return unlink(item.path);
    }

    moveFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        return this.renameFile(oldItem, newItem);
    }

    copyFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        const copyFile = promisify(fs.copyFile);
        return copyFile(oldItem.path, newItem.path);
    }
}
