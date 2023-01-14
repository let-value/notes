import { FileProvider } from "./FileProvider";

export interface Workspace {
    id: string;
    name: string;
    provider: FileProvider;
}

export type WorkspaceId = Workspace["id"];
