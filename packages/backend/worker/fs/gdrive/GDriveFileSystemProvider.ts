import { incrementFileNameIfExist } from "app/src/utils";
import { DispatcherService, frontend } from "messaging";
import { FileProvider, gapi, gdrive, Item, Workspace } from "models";
import { User } from "oidc-client-ts";
import { dirname, resolve } from "path";
import {
    addGDriveWorkspace,
    getGDriveWorkspace,
    getGDriveWorkspaces,
    updateGDriveWorkspace,
} from "../../db/repositories/gdriveWorkspaces";
import { addWorkspace, getWorkspaces } from "../../db/repositories/workspaces";
import { GDriveWorkspace } from "../../db/stores/gdriveWorkspaces";
import { ApiClient } from "../api/ApiClient";
import { FileSystemProvider } from "../FileSystemProvider";

export const directoryMimeType = "application/vnd.google-apps.folder";

export class GDriveFileSystemProvider implements FileSystemProvider {
    api: ApiClient<gapi.errors.ErrorResponse>;
    handles = new Map<string, gdrive.File>();
    gdriveWorkspace: GDriveWorkspace;

    constructor(private dispatcher: DispatcherService, public workspace?: Workspace) {
        this.api = new ApiClient(dispatcher, frontend.oidc.gdrive);
        this.api.user.subscribe((user) => this.updateWorkspace(user));
    }

    updateWorkspace(user: User): void {
        if (!this.gdriveWorkspace) {
            return;
        }

        updateGDriveWorkspace({ ...this.gdriveWorkspace, user });
    }

    async openWorkspace(): Promise<Workspace> {
        const root = await this.api.call<gdrive.File>("https://www.googleapis.com/drive/v3/files/root");

        const directory = await this.dispatcher.call<gdrive.File>(frontend.pickDirectory.gdrive, {
            root,
            user: this.api.user,
        });

        const workspaces = await getWorkspaces();
        const gdriveWorkspaces = await getGDriveWorkspaces();

        for (const workspace of gdriveWorkspaces) {
            if (workspace.id === directory.id) {
                return workspace;
            }
        }

        const workspaceNames = workspaces.map((workspace) => workspace.name);
        const name = incrementFileNameIfExist(directory.name, workspaceNames);

        const workspace: Workspace = { id: directory.id, name, provider: FileProvider.GDrive };
        await addWorkspace(workspace);
        await addGDriveWorkspace({ ...workspace, root, user: this.api.user.getValue() });

        return workspace;
    }

    async list(directory: gdrive.File) {
        const params = new URLSearchParams({
            q: `'${directory.id}' in parents and trashed = false`,
        });

        return await this.api.call<gdrive.FileList>("https://www.googleapis.com/drive/v3/files?" + params.toString());
    }

    async initializeWorkspace(workspace: Workspace): Promise<Item<true>> {
        this.workspace = workspace;

        this.gdriveWorkspace = await getGDriveWorkspace(workspace.id);
        this.api.setUser(this.gdriveWorkspace.user);

        const item = new Item(`/${workspace.id}`, workspace.name, true);
        this.handles.set(item.path, this.gdriveWorkspace.root ?? this.gdriveWorkspace);

        return item;
    }

    async listDirectory(item: Item<true>): Promise<Item[]> {
        const file = this.handles.get(item.path);

        const params = new URLSearchParams({
            q: `'${file.id}' in parents and trashed = false`,
        });

        const files = await this.api.call<gdrive.FileList>(
            "https://www.googleapis.com/drive/v3/files?" + params.toString(),
        );

        const items: Item[] = [];
        for (const child of files.files) {
            const name = child.name;
            const childItem = new Item(resolve(item.path, name), name, child.mimeType === directoryMimeType);
            this.handles.set(childItem.path, child);
            items.push(childItem);
        }

        return items;
    }

    async createDirectory(item: Item<true>): Promise<void> {
        let file = this.handles.get(item.path);

        if (file) {
            return;
        }

        const parentFile = this.handles.get(dirname(item.path));

        file = {
            name: item.name,
            mimeType: directoryMimeType,
            parents: [parentFile.id],
        };

        const response = await this.api.call<gdrive.File>("https://www.googleapis.com/drive/v3/files?alt=json", {
            method: "POST",
            body: JSON.stringify(file),
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.handles.set(item.path, response);
    }
    renameDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteDirectory(item: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    moveDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    copyDirectory(oldItem: Item<true>, newItem: Item<true>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async writeFile(item: Item<false>, data: string): Promise<void> {
        const parentFile = this.handles.get(dirname(item.path));
        const file = this.handles.get(item.path);

        if (file) {
            await this.api.call<gdrive.File>(
                "https://www.googleapis.com/upload/drive/v3/files/" + file.id + "?uploadType=media",
                {
                    method: "PATCH",
                    body: data,
                },
            );
        } else {
            const metadata = {
                name: item.name,
                parents: [parentFile.id],
            };

            const formData = new FormData();
            formData.append(
                "metadata",
                new Blob([JSON.stringify(metadata)], {
                    type: "application/json",
                }),
            );
            formData.append("media", new Blob([data]));

            const response = await this.api.call<gdrive.File>(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                {
                    method: "POST",
                    body: formData,
                },
            );

            this.handles.set(item.path, response);
        }
    }
    readFile(item: Item<false>): Promise<string> {
        const file = this.handles.get(item.path);

        return this.api.download("https://www.googleapis.com/drive/v3/files/" + file.id + "?alt=media");
    }
    renameFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteFile(item: Item<false>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    moveFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    copyFile(oldItem: Item<false>, newItem: Item<false>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
