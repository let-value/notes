import { Workspace } from "models";
import { atom } from "recoil";

export const workspaceState = atom<Workspace | undefined>({
    key: "workspace",
    default: undefined,
});
