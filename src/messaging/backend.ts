import { Item, Workspace } from "@/domain";
import { Query } from "./Query";

export const backend = {
    leader: new Query<string>("leader"),
    workspace: {
        openDirectory: new Query<Workspace>("workspace/openDirectory"),
        open: new Query<Workspace, string>("workspace/open"),
        treeItems: new Query<Item[], string>("workspace/getTree"),
    },
    workspaces: new Query<Workspace[]>("workspaces"),
};
