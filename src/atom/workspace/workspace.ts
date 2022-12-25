import { atom, selector, useRecoilCallback } from "recoil";
import { Workspace } from "../../domain/DirectoryHandle";
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

const getFilesRecursively = async function* (entry: FileSystemHandle): AsyncGenerator<FileSystemHandle> {
    if (entry.kind === "directory") {
        yield entry;
        for await (const handle of (entry as FileSystemDirectoryHandle).values()) {
            yield* getFilesRecursively(handle);
        }
    } else {
        yield entry;
    }
};

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

        const files: FileSystemHandle[] = [];

        for await (const fileHandle of getFilesRecursively(workspace.handle)) {
            files.push(fileHandle);
        }

        return files;
    },
});

export const fileState = atom<FileSystemFileHandle | null>({
    key: "file",
    default: null,
});

export const useSelectFile = () =>
    useRecoilCallback(
        ({ set }) =>
            async (handle: FileSystemHandle) => {
                if (handle.kind !== "file") {
                    return;
                }
                set(fileState, handle as FileSystemFileHandle);
            },
        [],
    );
