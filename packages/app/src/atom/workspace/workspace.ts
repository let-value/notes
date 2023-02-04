import { Workspace } from "models";
import { atom } from "recoil";
import { localStorageEffect } from "../localStorageEffect";

export const workspaceState = atom<Workspace>({
    key: "workspace",
    default: undefined,
    effects: [localStorageEffect("workspace")],
});
