import { backend } from "messaging";
import { FileProvider } from "models";
import { useRecoilCallback } from "recoil";
import { context } from "../storeServices";
import { workspaceState } from "../workspace/workspace";

export const useOpenDirectory = () =>
    useRecoilCallback(
        ({ set }) =>
            async () => {
                const workspace = await context.dispatcher.call(backend.workspace.openDirectory, FileProvider.Local);
                set(workspaceState, workspace);
            },
        [],
    );

export const useOpenGDrive = () =>
    useRecoilCallback(
        ({ set }) =>
            async () => {
                const workspace = await context.dispatcher.call(backend.workspace.openDirectory, FileProvider.GDrive);
                set(workspaceState, workspace);
            },
        [],
    );
