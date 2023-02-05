import { CellValue } from "hyperformula";
import { DatabaseMeta, FileProvider, gdrive, Item, Token, Workspace, WorkspaceId } from "models";
import { User } from "oidc-client-ts";
import { Query } from "../../Query";

export type FileContent = string;

export interface ItemQuery {
    workspaceId: WorkspaceId;
    path: Item["path"];
}

export interface ViewQuery extends ItemQuery {
    view: string;
}

export interface CreateItemQuery {
    workspaceId: WorkspaceId;
    path: Item["name"];
    name: Item["name"];
}

export interface MoveItemQuery {
    workspaceId: WorkspaceId;
    path: Item["path"];
    targetPath: Item["path"];
}

export interface SaveFileQuery {
    workspaceId: WorkspaceId;
    path: Item["path"];
    content: FileContent;
}

export const backend = {
    leader: new Query<string>("leader"),
    workspace: {
        openDirectory: new Query<Workspace, FileProvider>("workspace/openDirectory"),
        open: new Query<Workspace, string>("workspace/open"),
        root: new Query<Item<true>, WorkspaceId, WorkspaceId>("workspace/root"),
        items: new Query<Item[], ItemQuery, ItemQuery>("workspace/items"),
        directory: {
            create: new Query<boolean, CreateItemQuery>("workspace/directory/create"),
            move: new Query<boolean, MoveItemQuery>("workspace/directory/move"),
            copy: new Query<boolean, MoveItemQuery>("workspace/directory/copy"),
        },
        file: {
            create: new Query<boolean, CreateItemQuery>("workspace/file/create"),
            move: new Query<boolean, MoveItemQuery>("workspace/file/move"),
            copy: new Query<boolean, MoveItemQuery>("workspace/file/copy"),
            content: new Query<FileContent, ItemQuery>("workspace/fileContent"),
            tokens: new Query<Token[], ItemQuery>("workspace/readFileTokens"),
            save: new Query<boolean, SaveFileQuery>("workspace/saveContent"),
        },
        database: {
            meta: new Query<DatabaseMeta, ItemQuery>("workspace/database/get"),
            view: new Query<CellValue[][], ViewQuery, ViewQuery>("workspace/database/view"),
        },
    },
    workspaces: new Query<Workspace[]>("workspaces"),
    gdrive: {
        list: new Query<gdrive.FileList, { directory: gdrive.File; user: User }>("gdrive/list"),
    },
};
