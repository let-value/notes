import { atom, selector } from "recoil";
import { Workspace } from "../../domain/Workspace";
import { mode } from "./DirectoryPermissionMode";

export const workspaceState = atom<Workspace | undefined>({
    key: "workspace",
    default: undefined,
});

export const permissionSelector = selector({
    key: "permission",
    get: async ({ get }) => {
        const workspace = get(workspaceState);
        if (!workspace) {
            return undefined;
        }

        return await workspace.handle.queryPermission({ mode });
    },
});

export const directorySelector = selector({
    key: "directories",
    get: async ({ get }) => {
        const permissionGranted = get(permissionSelector);
        if (permissionGranted !== "granted") {
            return undefined;
        }

        const workspace = get(workspaceState);
        if (!workspace) {
            return undefined;
        }
    },
});
