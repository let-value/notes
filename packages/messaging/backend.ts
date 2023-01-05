import { Item, Token, Workspace, WorkspaceId } from "models";
import { Query } from "./Query";

export interface ReadFileQuery {
    workspaceId: WorkspaceId;
    path: Item["path"];
}

export const backend = {
    leader: new Query<string>("leader"),
    workspace: {
        openDirectory: new Query<Workspace>("workspace/openDirectory"),
        open: new Query<Workspace, string>("workspace/open"),
        items: new Query<Item[], ReadFileQuery>("workspace/items"),
        file: {
            content: new Query<string, ReadFileQuery>("workspace/fileContent"),
            tokens: new Query<Token[], ReadFileQuery>("workspace/readFileTokens"),
        },
    },
    workspaces: new Query<Workspace[]>("workspaces"),
};
