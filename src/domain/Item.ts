export interface Item {
    id: string;
    parentId?: string;
    name: string;
    isDirectory: boolean;
    workspaceId: string;
}
