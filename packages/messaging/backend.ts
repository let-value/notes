import { Item, Token, Workspace, WorkspaceId } from "models";
import { Query } from "./Query";

export type FileContent = string;

export interface ReadFileQuery {
    workspaceId: WorkspaceId;
    path: Item["path"];
}

export interface SaveFileQuery {
    workspaceId: WorkspaceId;
    path: Item["path"];
    content: FileContent;
}

export const backend = {
    leader: new Query<string>("leader"),
    workspace: {
        openDirectory: new Query<Workspace>("workspace/openDirectory"),
        open: new Query<Workspace, string>("workspace/open"),
        items: new Query<Item[], ReadFileQuery>("workspace/items"),
        file: {
            content: new Query<FileContent, ReadFileQuery>("workspace/fileContent"),
            tokens: new Query<Token[], ReadFileQuery>("workspace/readFileTokens"),
            save: new Query<boolean, SaveFileQuery>("workspace/saveContent"),
        },
    },
    workspaces: new Query<Workspace[]>("workspaces"),
};
