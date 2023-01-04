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
        files: new Query<Item[], string, string>("workspace/getTree"),
        fileContent: new Query<string, ReadFileQuery>("workspace/fileContent"),
        fileTokens: new Query<Token[], ReadFileQuery>("workspace/readFileTokens"),
    },
    workspaces: new Query<Workspace[]>("workspaces"),
};
