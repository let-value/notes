import { context } from "@/atom/storeServices";
import { backend } from "messaging";
import { WorkspaceId } from "models";
import { atom, useRecoilCallback } from "recoil";
import { ListItem } from "./ListItem";

export const newItemState = atom<ListItem | undefined>({
    key: "workspace/items/new",
    default: undefined,
});

export const useCreateDirectory = (workspaceId: WorkspaceId, item: ListItem<true>) =>
    useRecoilCallback(
        ({ set }) =>
            async (name: string) => {
                set(newItemState, undefined);

                if (!name) {
                    return;
                }

                await context.dispatcher.call(backend.workspace.directory.create, {
                    workspaceId,
                    path: item.path,
                    name,
                });
            },
        [item.path, workspaceId],
    );

export const useCreateFile = (workspaceId: WorkspaceId, item: ListItem<false>) =>
    useRecoilCallback(
        ({ set }) =>
            async (name: string) => {
                set(newItemState, undefined);

                if (!name) {
                    return;
                }

                await context.dispatcher.call(backend.workspace.file.create, { workspaceId, path: item.path, name });
            },
        [item.path, workspaceId],
    );
