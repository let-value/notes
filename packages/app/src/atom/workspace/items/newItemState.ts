import { context } from "@/atom/storeServices";
import { backend } from "messaging";
import { atom, useRecoilCallback } from "recoil";
import { workspaceState } from "../workspace";
import { ListItem } from "./ListItem";

export const newItemState = atom<ListItem | undefined>({
    key: "workspace/items/new",
    default: undefined,
});

export const useCreateDirectory = (item: ListItem<true>) =>
    useRecoilCallback(
        ({ set, snapshot }) =>
            async (name: string) => {
                set(newItemState, undefined);

                if (!name) {
                    return;
                }

                const workspace = await snapshot.getPromise(workspaceState);

                await context.dispatcher.call(backend.workspace.directory.create, {
                    workspaceId: workspace.id,
                    path: item.path,
                    name,
                });
            },
        [item.path],
    );

export const useCreateFile = (item: ListItem<false>) =>
    useRecoilCallback(
        ({ set, snapshot }) =>
            async (name: string) => {
                set(newItemState, undefined);

                if (!name) {
                    return;
                }

                const workspace = await snapshot.getPromise(workspaceState);

                await context.dispatcher.call(backend.workspace.file.create, {
                    workspaceId: workspace.id,
                    path: item.path,
                    name,
                });
            },
        [item.path],
    );
