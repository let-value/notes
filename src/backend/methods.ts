import { Workspace } from "../domain";
import { ApiMethod } from "./ApiMethod";

export const methods = {
    worker: new ApiMethod<string>("worker"),
    workspaces: new ApiMethod<Workspace[]>("workspaces"),
};
