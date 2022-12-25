export interface Workspace {
    id: string;
    name: string;
    handle: FileSystemDirectoryHandle;
}

export type WorkspaceId = Workspace["id"];
