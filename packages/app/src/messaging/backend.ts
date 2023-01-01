import { Item, Workspace, WorkspaceId } from "@/domain";
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
        readFile: new Query<string, ReadFileQuery>("workspace/readFile"),
    },
    workspaces: new Query<Workspace[]>("workspaces"),
};
