import { Workspace } from "models";
import { atom } from "recoil";

export const workspaceState = atom<Workspace>({
    key: "workspace",
    default: undefined,
});
