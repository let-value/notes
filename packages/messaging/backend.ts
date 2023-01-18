import { Item, Token, Workspace, WorkspaceId } from "models";
import { Query } from "./Query";

export type FileContent = string;

export interface ItemQuery {
    workspaceId: WorkspaceId;
    path: Item["path"];
}

export interface CreateItemQuery {
    workspaceId: WorkspaceId;
    path: Item["name"];
    name: Item["name"];
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
        root: new Query<Item<true>, WorkspaceId, WorkspaceId>("workspace/root"),
        items: new Query<Item[], ItemQuery, ItemQuery>("workspace/items"),
        directory: {
            create: new Query<boolean, CreateItemQuery>("workspace/directory/create"),
        },
        file: {
            create: new Query<boolean, CreateItemQuery>("workspace/file/create"),
            content: new Query<FileContent, ItemQuery>("workspace/fileContent"),
            tokens: new Query<Token[], ItemQuery>("workspace/readFileTokens"),
            save: new Query<boolean, SaveFileQuery>("workspace/saveContent"),
        },
    },
    workspaces: new Query<Workspace[]>("workspaces"),
};
