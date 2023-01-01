export interface Workspace {
    id: string;
    name: string;
}

export interface WorkspaceHandle extends Workspace {
    handle: FileSystemDirectoryHandle;
}

export type WorkspaceId = Workspace["id"];
